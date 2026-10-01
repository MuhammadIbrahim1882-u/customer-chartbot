(function () {
  "use strict";

  var KB = window.KB;
  var STORE_KEY = "harbor_chat_history";
  var TICKETS_KEY = "harbor_tickets";

  var messagesEl = document.getElementById("messages");
  var chipsEl = document.getElementById("chips");
  var topicsEl = document.getElementById("topics");
  var inputEl = document.getElementById("input");
  var sendBtn = document.getElementById("sendBtn");
  var clearBtn = document.getElementById("clearBtn");

  var history = [];

  // ---------- storage helpers (safe if storage is blocked) ----------
  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  // ---------- rendering ----------
  function timeNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function scrollDown() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderMessage(who, text, time, isHtml) {
    var div = document.createElement("div");
    div.className = "msg " + who;
    var body = document.createElement("span");
    if (isHtml) { body.innerHTML = text; } else { body.textContent = text; }
    var t = document.createElement("time");
    t.textContent = time;
    div.appendChild(body);
    div.appendChild(t);
    messagesEl.appendChild(div);
    scrollDown();
  }

  function addMessage(who, text, isHtml) {
    var time = timeNow();
    renderMessage(who, text, time, isHtml);
    history.push({ who: who, text: text, time: time, html: !!isHtml });
    save(STORE_KEY, history);
  }

  function setChips(list) {
    chipsEl.innerHTML = "";
    (list || []).forEach(function (label) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", function () { handleUser(label); });
      chipsEl.appendChild(b);
    });
  }

  function showTyping() {
    var div = document.createElement("div");
    div.className = "msg bot typing";
    div.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(div);
    scrollDown();
    return div;
  }

  function botReply(text, chips, action) {
    setChips([]);
    var typing = showTyping();
    var delay = 450 + Math.min(text.length * 6, 900);
    setTimeout(function () {
      typing.remove();
      addMessage("bot", text, true);
      setChips(chips && chips.length ? chips : []);
      if (action === "ticket") { showTicketForm(); }
    }, delay);
  }

  // ---------- understanding the message ----------
  function normalize(s) {
    return " " + s.toLowerCase().replace(/[^\w\s'-]/g, " ").replace(/\s+/g, " ").trim() + " ";
  }

  function findOrderId(text) {
    var m = text.match(/ord[\s-]?(\d{4})/i);
    return m ? "ORD-" + m[1] : null;
  }

  function bestIntent(text) {
    var norm = normalize(text);
    var best = null;
    var bestScore = 0;
    KB.intents.forEach(function (intent) {
      var score = 0;
      intent.keywords.forEach(function (kw) {
        var k = kw.toLowerCase();
        // whole-word match for short words, substring for phrases
        var hit = k.indexOf(" ") === -1 ? norm.indexOf(" " + k + " ") !== -1 || norm.indexOf(" " + k + "s ") !== -1 : norm.indexOf(k) !== -1;
        if (hit) { score += 1 + k.split(" ").length * 0.5; }
      });
      if (score > bestScore) { bestScore = score; best = intent; }
    });
    return best;
  }

  function orderCard(id, o) {
    var steps = ["Processing", "Shipped", "Delivered"];
    var idx = steps.indexOf(o.status);
    var track = steps.map(function (st, i) {
      return '<li class="' + (i <= idx ? "done" : "") + '">' + st + "</li>";
    }).join("");
    return '<div class="order">' +
      '<div class="order-top"><b>' + id + '</b><span class="pill pill-' + o.status.toLowerCase() + '">' + o.status + "</span></div>" +
      '<div class="order-items">' + o.items + "</div>" +
      '<ol class="track">' + track + "</ol>" +
      "<p>" + o.detail + "</p></div>";
  }

  function orderAnswer(id) {
    var o = KB.orders[id];
    if (!o) {
      return {
        text: "I couldn't find an order called <b>" + id + "</b>. Check the ID in your confirmation email, or I can connect you to an agent.",
        chips: ["Talk to a human", "Track my order"]
      };
    }
    return {
      text: orderCard(id, o),
      chips: ["Return an item", "Shipping times"]
    };
  }

  // ---------- main handler ----------
  function handleUser(text) {
    text = text.trim();
    if (!text) { return; }
    addMessage("user", text, false);
    inputEl.value = "";

    var orderId = findOrderId(text);
    if (orderId) {
      var r = orderAnswer(orderId);
      botReply(r.text, r.chips);
      return;
    }

    var intent = bestIntent(text);
    if (intent) {
      botReply(intent.answer, intent.chips, intent.action);
    } else {
      botReply(KB.fallback, KB.defaultChips);
    }
  }

  // ---------- human handoff ticket ----------
  function showTicketForm() {
    var box = document.createElement("div");
    box.className = "ticket";
    box.innerHTML =
      '<input type="text" placeholder="Your name" aria-label="Your name" id="tName">' +
      '<input type="email" placeholder="Email address" aria-label="Email address" id="tEmail">' +
      '<textarea placeholder="Describe the problem" aria-label="Describe the problem" id="tIssue"></textarea>' +
      '<p class="err" id="tErr" hidden></p>' +
      '<button type="button" id="tSend">Send to an agent</button>';
    messagesEl.appendChild(box);
    scrollDown();

    box.querySelector("#tSend").addEventListener("click", function () {
      var name = box.querySelector("#tName").value.trim();
      var email = box.querySelector("#tEmail").value.trim();
      var issue = box.querySelector("#tIssue").value.trim();
      var err = box.querySelector("#tErr");
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || issue.length < 5) {
        err.hidden = false;
        err.textContent = "Enter your name, a valid email and a short description of the problem.";
        return;
      }

      var tickets = load(TICKETS_KEY, []);
      var ticketId = "TCK-" + String(1000 + tickets.length + 1);
      tickets.push({ id: ticketId, name: name, email: email, issue: issue, created: new Date().toISOString() });
      save(TICKETS_KEY, tickets);

      box.remove();
      botReply("Thanks, " + escapeHtml(name) + ". Your request <b>" + ticketId + "</b> is with our team. We'll reply to " + escapeHtml(email) + " within one business day.", ["Shipping times", "Return an item"]);
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- setup ----------
  function buildTopics() {
    ["Track my order", "Shipping times", "Return an item", "Refund timing", "Payment methods", "Reset my password", "Talk to a human"].forEach(function (label) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", function () { handleUser(label); });
      topicsEl.appendChild(b);
    });
  }

  function start() {
    messagesEl.innerHTML = "";
    history = [];
    save(STORE_KEY, history);
    botReply(KB.welcome, KB.defaultChips);
  }

  function restore() {
    var saved = load(STORE_KEY, []);
    if (!saved.length) { start(); return; }
    history = saved;
    saved.forEach(function (m) { renderMessage(m.who, m.text, m.time, m.html); });
    setChips(KB.defaultChips);
  }

  sendBtn.addEventListener("click", function () { handleUser(inputEl.value); });
  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { handleUser(inputEl.value); }
  });
  clearBtn.addEventListener("click", start);

  buildTopics();
  restore();
  inputEl.focus();
})();
