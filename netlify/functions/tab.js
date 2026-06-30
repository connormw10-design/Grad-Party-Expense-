import { getStore } from "@netlify/blobs";

// One shared blob holds the entire tab (people + expenses).
// Strong consistency so an edit is visible on the very next read.
const STORE = "shared-tab";
const KEY = "tab";

const DEFAULT_TAB = {
  tripName: "Grad Party 2026",
  people: [
    { id: "p1", name: "Andra" },
    { id: "p2", name: "Jenny" },
    { id: "p3", name: "Kerry K" },
    { id: "p4", name: "Kerri W" },
    { id: "p5", name: "Julie" },
  ],
  expenses: [],
};

const json = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

// Build the store. When Netlify auto-injects Blobs context, getStore({name})
// just works. When it doesn't (some deploy setups), fall back to the manual
// siteID + token that Netlify asks for, read from environment variables.
function openStore() {
  const opts = { name: STORE, consistency: "strong" };
  const siteID = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  if (siteID && token) {
    opts.siteID = siteID;
    opts.token = token;
  }
  return getStore(opts);
}

export const handler = async (event) => {
  const store = openStore();

  try {
    if (event.httpMethod === "GET") {
      const tab = await store.get(KEY, { type: "json" });
      if (!tab) {
        await store.setJSON(KEY, DEFAULT_TAB);
        return json(200, DEFAULT_TAB);
      }
      return json(200, tab);
    }

    if (event.httpMethod === "POST") {
      const next = JSON.parse(event.body || "{}");
      // Basic shape guard so a bad write can't corrupt the tab.
      if (!Array.isArray(next.people) || !Array.isArray(next.expenses)) {
        return json(400, { error: "Invalid tab format" });
      }
      await store.setJSON(KEY, next);
      return json(200, next);
    }

    return json(405, { error: "Method not allowed" });
  } catch (err) {
    return json(500, { error: String(err) });
  }
};
