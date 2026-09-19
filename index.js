/* ============================================================
   pulse — Appwrite Function (Node.js)
   ------------------------------------------------------------
   The static site's heartbeat. Two jobs:
     1. page_view  → store event, return total views for the page
     2. feedback   → store thumbs-up/down with the page path

   Collections (create once, see appwrite/README.md):
     events: [type: string, path: string, value: string, ts: datetime]

   Set these function environment variables after creating the DB:
     DATABASE_ID, COLLECTION_ID

   Execution access: enable "Any" (anonymous) in the function's
   Settings → Execute Access, so the static site can call it.
   ============================================================ */
const sdk = require("node-appwrite");

module.exports = async ({ req, res, log, error }) => {
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

  const databases = new sdk.Databases(client);
  const dbId = process.env.DATABASE_ID;
  const colId = process.env.COLLECTION_ID;

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch (e) { /* empty body */ }

  const type = body.type === "feedback" ? "feedback" : "page_view";
  const path = String(body.path || "/").slice(0, 300);
  const value = String(body.value || "").slice(0, 50);

  try {
    await databases.createDocument(dbId, colId, sdk.ID.unique(), {
      type,
      path,
      value,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    error("store failed: " + e.message);
  }

  let views = null;
  try {
    const q = await databases.listDocuments(dbId, colId, [
      sdk.Query.equal("path", path),
      sdk.Query.equal("type", "page_view"),
      sdk.Query.limit(1),
    ]);
    views = q.total;
  } catch (e) {
    error("count failed: " + e.message);
  }

  log(`${type} ${path} ${value} (views=${views})`);
  return res.json({ ok: true, type, path, views }, 200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Appwrite-Project",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  });
};
