# Shared Tab — Deploy Guide

A live, shared expense tracker for the grad party. Five hosts, one link,
no accounts, no Claude. Anyone adds an expense → everyone sees it.

You deploy it once. They just tap a bookmark.

---

## What's in this folder

```
shared-tab/
├─ public/
│  └─ index.html              ← the whole app (frontend)
├─ netlify/
│  └─ functions/
│     └─ tab.js               ← saves/loads the shared data
├─ netlify.toml               ← routing config
└─ package.json               ← one dependency (@netlify/blobs)
```

You don't need to edit any of it. Just deploy.

---

## Deploy (this is the same flow as your World Cup app)

### Option 1 — Connect to GitHub (recommended, gives you auto-updates)

1. Make a new GitHub repo and push this whole `shared-tab` folder to it.
2. Go to https://app.netlify.com → **Add new site** → **Import an existing project**.
3. Pick the repo. Netlify reads `netlify.toml` automatically —
   leave the build settings as detected and click **Deploy**.
4. Wait ~1 minute. You'll get a URL like `https://something-random.netlify.app`.

### Option 2 — Netlify CLI (fastest if you have it installed)

```bash
cd shared-tab
npm install
npx netlify deploy --prod
```

(If it asks, choose "create & configure a new site" and set the publish
directory to `public`.)

---

## After it deploys

1. **Rename the site** (optional but nice): in Netlify →
   Site configuration → Change site name → e.g. `gradparty-tab`,
   so the link becomes `https://gradparty-tab.netlify.app`.
2. **Open the link yourself first** and add a test expense to confirm it saves
   (the status dot top-right turns green = saved).
3. **Send the link to the five of them.** Tell them to:
   - Open it in their phone browser.
   - **iPhone:** tap the Share icon → "Add to Home Screen."
   - **Android:** tap the ⋮ menu → "Add to Home screen."
   That puts an app icon on their phone. No app store, no login.

---

## How it works (so you can answer questions)

- All five names (Andra, Jenny, Kerry K, Kerri W, Julie) are pre-loaded.
- Everyone reads and writes the *same* shared tab via the Netlify function.
- The app refreshes every 4 seconds, so a new expense shows up for everyone
  within a few seconds — no refresh button needed.
- Money is stored in whole cents, balances are recalculated from scratch
  every time, and they always add up to zero.

---

## Notes / limits

- It's a single shared tab with no passwords — anyone with the link can view
  and edit. That's fine for five trusted friends; don't post the link publicly.
- It's one party's worth of data. If you want to reuse it for a different
  event later, just delete the expenses (or I can add a "new event" reset).
- Netlify's free tier covers this use easily.

If you want me to add anything — a running total per category, a "mark as paid"
button on the settle-up screen, or a simple passcode — just ask.
