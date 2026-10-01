# Customer Support Chatbot (Harbor Goods)

A working customer support chatbot in plain HTML, CSS and JavaScript. No install, no server, no API key.

## Run it

1. Keep all five files in the same folder.
2. Double-click `index.html` to open it in your browser.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page layout |
| `style.css` | Design and responsive layout |
| `knowledge.js` | The bot's knowledge: answers, keywords, demo orders |
| `script.js` | Chat logic: matching, typing indicator, order tracking, human handoff, saved history |
| `README.md` | This file |

## What it does

- Answers questions on shipping, returns, refunds, payments, account help, discounts and support hours
- Tracks orders: type `ORD-1001`, `ORD-1002` or `ORD-1003`
- Quick-reply buttons after every answer
- "Talk to a human" opens a short form and creates a ticket (saved in the browser's localStorage under `harbor_tickets`)
- Chat history is kept when you reload; "Clear chat" starts over

## Customize

- **Change answers or add topics:** edit `intents` in `knowledge.js`. Add `keywords` the customer might type and an `answer` (basic HTML like `<b>` and `<br>` works).
- **Change the store name or demo orders:** edit `storeName` and `orders` in `knowledge.js`, and the title text in `index.html`.
- **Change colors:** edit the variables at the top of `style.css`.

## Next steps (optional)

To connect real orders or an AI model, replace the `orderAnswer()` and `bestIntent()` functions in `script.js` with calls to your backend. Never put an API key in front-end code; call it from a server.
