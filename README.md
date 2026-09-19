# Pulse — Appwrite backend for The Specialty Atlas

The site works 100% statically. This backend adds a heartbeat: **anonymous page views + a feedback widget**, stored in an Appwrite database.

> **Why Appwrite + GitHub Pages?** GitHub Pages hosts static files only — it can't run code or store data. Appwrite provides the tiny dynamic layer: one Function + one collection.

## Setup (~10 minutes, free tier is enough)

### 1. Create the project
1. Go to [cloud.appwrite.io](https://cloud.appwrite.io) → **Create project** → name it `specialty-atlas`.
2. Copy the **Project ID**.

### 2. Create the database
1. **Databases → Create database** → name it `pulse`. Copy the **Database ID**.
2. Inside it, **Create collection** → name it `events`. Copy the **Collection ID**.
3. In the collection → **Attributes**, add:
   - `type` — String, size 20, required
   - `path` — String, size 300, required
   - `value` — String, size 50
   - `ts` — String, size 40 (ISO datetime)
4. **Indexes** → create an index on `path` + `type` (speeds up the view counter).
5. **Settings → Permissions**: leave everything **denied** (only the server-side function key writes here — never the browser).

### 3. Create the function
1. **Functions → Create function → Node.js** (v18+). Name it `pulse`, set **Execute access → Any** (so the static site can call it anonymously).
2. Paste the contents of `functions/pulse/index.js` into the editor (or deploy with the CLI, below).
3. Add the dependency `node-appwrite` (the editor installs it when you deploy; via CLI it's in `package.json`).
4. Function **Settings → Environment variables**, add:
   - `DATABASE_ID` = your database ID
   - `COLLECTION_ID` = your collection ID
5. Deploy a new version and **activate** it.

<details><summary>CLI alternative (appwrite.json)</summary>

```bash
npm install -g appwrite-cli
appwrite login
appwrite init function pulse   # then copy functions/pulse/* into it
appwrite deploy function pulse
```
</details>

### 4. Wire up the site
Edit `site/assets/js/pulse-config.js`:

```js
window.PULSE_CONFIG = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "<YOUR PROJECT ID>",
  functionId: "pulse",
};
```

Commit & push. Done — pages start recording views, and the footer shows **▲ Useful / ▼ Needs work** buttons.

## Privacy

- No accounts, no cookies, no personal data — just `path`, an optional 👍/👎, and a timestamp.
- All writes happen server-side with the function's API key; the browser never touches the database.

## If you skip this

Nothing breaks. The widget simply stays hidden and the site remains a pure static site.
