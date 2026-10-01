// Edit this file to change what the bot knows. No other file needs to change.
window.KB = {
  storeName: "Harbor Goods",

  welcome: "Hi, I'm the Harbor Goods assistant. I can track an order, explain shipping and returns, or connect you with a person. What do you need?",

  fallback: "I'm not sure I understood that. You can ask about orders, shipping, returns, refunds, payments or your account, or ask for a human agent.",

  defaultChips: ["Track my order", "Shipping times", "Return an item", "Payment methods", "Talk to a human"],

  // Demo orders for the tracking feature
  orders: {
    "ORD-1001": { status: "Delivered", detail: "Delivered on 24 Sep 2026 to your front door.", items: "Canvas Backpack" },
    "ORD-1002": { status: "Shipped", detail: "In transit with Express Courier. Expected delivery: 3 Oct 2026.", items: "Steel Water Bottle x2" },
    "ORD-1003": { status: "Processing", detail: "We're packing your order. It ships within 1 business day.", items: "Linen Throw Blanket" }
  },

  // Each intent: keywords are matched against the user's message (more matches = higher score)
  intents: [
    {
      id: "greeting",
      keywords: ["hi", "hello", "hey", "good morning", "good evening", "salam", "assalam"],
      answer: "Hello! How can I help you today?",
      chips: ["Track my order", "Return an item", "Talk to a human"]
    },
    {
      id: "thanks",
      keywords: ["thanks", "thank you", "thx", "shukriya", "appreciate"],
      answer: "You're welcome! Is there anything else I can help with?",
      chips: ["Shipping times", "Talk to a human"]
    },
    {
      id: "bye",
      keywords: ["bye", "goodbye", "see you", "that's all", "nothing else"],
      answer: "Thanks for contacting Harbor Goods. Have a great day!",
      chips: []
    },
    {
      id: "track",
      keywords: ["track", "where is my order", "order status", "my order", "delivery status", "parcel", "package"],
      answer: "To track an order, send me your order ID (for example <b>ORD-1002</b>). You'll find it in your confirmation email.",
      chips: ["ORD-1001", "ORD-1002", "ORD-1003"]
    },
    {
      id: "shipping",
      keywords: ["shipping", "delivery", "deliver", "how long", "ship", "courier", "arrive", "international"],
      answer: "<b>Shipping times</b><br>Standard: 3–5 business days (free over $50, otherwise $4.99)<br>Express: 1–2 business days ($12.99)<br>International: 7–14 business days, rates shown at checkout.",
      chips: ["Track my order", "Return an item"]
    },
    {
      id: "returns",
      keywords: ["return", "send back", "exchange", "wrong item", "damaged", "broken", "defective"],
      answer: "You can return most items within <b>30 days</b> of delivery if they're unused and in original packaging.<br>1. Go to My Orders and choose <b>Start a return</b>.<br>2. Print the prepaid label.<br>3. Drop the parcel at any courier point.<br>Damaged or wrong item? Tell us and we'll cover the shipping.",
      chips: ["Refund timing", "Talk to a human"]
    },
    {
      id: "refund",
      keywords: ["refund", "money back", "reimburse", "cancel order", "cancel", "cancellation"],
      answer: "Refunds go back to your original payment method <b>5–7 business days</b> after we receive the return. Orders can be cancelled free of charge until they ship.",
      chips: ["Return an item", "Payment methods"]
    },
    {
      id: "payment",
      keywords: ["payment", "pay", "card", "visa", "mastercard", "paypal", "cash on delivery", "cod", "charged", "invoice"],
      answer: "We accept Visa, Mastercard, PayPal and cash on delivery (domestic orders only). All card payments are encrypted. If you were charged twice, a human agent can check it for you.",
      chips: ["Talk to a human", "Refund timing"]
    },
    {
      id: "account",
      keywords: ["account", "password", "login", "log in", "sign in", "forgot", "reset", "email change"],
      answer: "To reset your password, choose <b>Forgot password</b> on the sign-in page and follow the email link (it expires in 30 minutes). Check your spam folder if it doesn't arrive.",
      chips: ["Talk to a human"]
    },
    {
      id: "hours",
      keywords: ["hours", "open", "contact", "phone", "support time", "working hours", "address"],
      answer: "Our human agents are available Monday to Friday, 9:00–18:00. You can also email support@harborgoods.example any time.",
      chips: ["Talk to a human"]
    },
    {
      id: "discount",
      keywords: ["discount", "coupon", "promo", "voucher", "sale", "offer", "code"],
      answer: "Enter your promo code at checkout. Codes can't be combined, and they don't apply to sale items. New customers get 10% off with <b>WELCOME10</b>.",
      chips: ["Shipping times", "Payment methods"]
    },
    {
      id: "human",
      keywords: ["human", "agent", "person", "representative", "talk to someone", "real person", "complaint", "manager", "speak"],
      answer: "Of course. Leave your details and a human agent will reply by email within one business day.",
      chips: [],
      action: "ticket"
    }
  ]
};
