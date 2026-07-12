# Acme Bank demo site

A fake marketing site for "Acme Bank" with an embedded Cognigy webchat widget in the
bottom-right corner. Built to demo LENA / the Acme Bank webchat agent alongside your
existing Render-hosted Cognigy API + Postgres.

This is a static site served by a tiny Express app, so it deploys as its own Render
Web Service, separate from your Cognigy API/DB service.

```
acme-bank-demo-site/
├── server.js              # Express static server (Render entrypoint)
├── package.json
├── render.yaml             # optional Render Blueprint (auto-config)
├── public/
│   ├── index.html          # the site
│   ├── css/styles.css
│   ├── js/main.js           # wires the chat buttons to the widget
│   ├── js/cognigy-embed.js  # Cognigy Endpoint URL + Support Concierge branding live here
│   └── img/support-team.jpg
└── README.md
```

## 1. What's already wired up

This package ships with your real Cognigy Endpoint URL already filled in
(`public/js/cognigy-embed.js`), pointed at the Webchat v3 endpoint you shared in this
session. The floating bubble is labeled **Support Concierge** (not any individual agent
name) — it's the generic front door that Cognigy routes to Mac or Lena internally based
on the conversation.

If you ever need to point this at a different endpoint (a new environment, a second demo,
etc.), open `public/js/cognigy-embed.js` and swap this line:

```js
window.__COGNIGY_ENDPOINT_URL__ = "https://endpoint-trial.cognigy.ai/9863dba1d12ed73f7ed01800c7da5c4d66004f28e3efa2ddadf4b9794f47c34c";
```

To get a fresh one: open your Acme Bank project in Cognigy.AI, go to **Deploy > Endpoints**,
open (or create) a **Webchat v3** endpoint pointed at your Flow, and copy its **Endpoint URL**
(looks like `https://endpoint-trial.cognigy.ai/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` — that
includes your URL token, so it's the full URL, not just the token). You do **not** need a
separate API key for the Webchat embed — the Endpoint URL is scoped to be safe for
client-side/browser use.

Two things worth knowing about the "Support Concierge" branding:
- The **title** shown in the widget header is set in code (`widgetSettings.title` in
  `cognigy-embed.js`) — that's guaranteed to say "Support Concierge" regardless of what's
  configured on the Cognigy side.
- The **avatar/logo** shown next to bot messages is controlled by Cognigy's Endpoint
  settings (Deploy > your endpoint > Webchat Settings > Layout). If that's currently set to
  Lena's photo, swap it there for a neutral icon — code-side CSS overrides can reskin colors
  but can't reliably rename bot-message avatars.

## 2. Run it locally (optional but recommended)

```bash
cd acme-bank-demo-site
npm install
npm start
```

Visit `http://localhost:3000` and click any of the chat buttons — the Support Concierge
widget should load since the endpoint URL is already in place.

## 3. Push it to GitHub

From inside the `acme-bank-demo-site` folder:

```bash
git init
git add .
git commit -m "Initial Acme Bank demo site"
```

Create a new empty repo on GitHub (no README/license — you already have files), then:

```bash
git remote add origin https://github.com/<your-username>/acme-bank-demo-site.git
git branch -M main
git push -u origin main
```

## 4. Deploy on Render

**Option A — Blueprint (fastest):**
1. In Render, click **New > Blueprint**.
2. Connect the GitHub repo you just pushed.
3. Render reads `render.yaml` and proposes an `acme-bank-demo-site` Web Service on the
   free plan — confirm and deploy.

**Option B — Manual Web Service:**
1. In Render, click **New > Web Service**.
2. Connect the GitHub repo.
3. Settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or whatever tier you like)
4. Click **Create Web Service**.

Either way, Render will give you a URL like `https://acme-bank-demo-site.onrender.com`.
Open it, click the chat bubble, and you should see your Cognigy webchat load.

## 5. Updating later

Any time you edit files locally:

```bash
git add .
git commit -m "describe the change"
git push
```

Render auto-deploys on push (that's what `autoDeploy: true` in `render.yaml` does, and
it's also the default for manually created services).

## 6. Two bugs fixed after the first Render deploy

**Double chat bubble.** Cognigy's Webchat v3 renders its own default launcher button
in addition to any custom button you build, unless you explicitly hide it with CSS. The
hide rule needs an extra attribute selector (`[data-cognigy-webchat-toggle]`) that's easy
to miss — without it, the rule silently matches nothing and both buttons show up stacked
on top of each other. Fixed in `public/css/styles.css`.

**Had to click "Start Conversation."** This was a settings bug, not a Cognigy limitation.
`startBehavior` has to live in its own top-level `startBehavior: { ... }` object — it does
**not** go inside a `behavior` object (that was the mistake in the first version of
`cognigy-embed.js`). With the key in the wrong place, Cognigy silently ignored it and fell
back to the endpoint's own default (a "Get Started" button). It's now set to
`startBehavior: "injection"`, which sends the same `GET_STARTED` payload the button used to
send, but does it automatically the instant the widget opens — so the greeting appears
immediately and the visitor can just reply.

If the greeting still doesn't appear after this fix, that points to the Flow side rather
than the website: open the Flow in Cognigy.AI and confirm there's a node that responds to
a `GET_STARTED` input with the "Hi, I'm Mac, your support concierge..." message (or
whatever trigger your Default Welcome Intent uses — update `getStartedPayload` in
`cognigy-embed.js` to match if it's not literally `GET_STARTED`).

## Notes on the mockup content

Every fact on the page (hours, transfer limits, overdraft fee, security rules, loan
types) is pulled directly from your two demo knowledge sources — nothing here is
invented banking policy. If you update the KB, update the matching numbers in
`public/index.html` (search for the `<section>` blocks — they're labeled by topic).

The site is intentionally marked as a synthetic demo in a top ribbon and the footer, per
the "Demo Boundaries" rule in your knowledge source, so nobody mistakes it for a real bank.
