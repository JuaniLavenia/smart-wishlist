import type { VercelRequest, VercelResponse } from "@vercel/node";

const SERPAPI_BASE = "https://serpapi.com/search.json";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get API key from query params or environment
  const apiKey = (req.query.api_key as string) || process.env.SERPAPI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ error: "API key not configured" });
  }

  // Build SerpApi params
  const params = new URLSearchParams({
    api_key: apiKey,
    engine: "google_shopping",
    ...Object.fromEntries(
      Object.entries(req.query).filter(([key]) => key !== "api_key"),
    ),
  });

  try {
    const response = await fetch(`${SERPAPI_BASE}?${params.toString()}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SerpApi error ${response.status}: ${errorText}`);
      return res.status(response.status).json({
        error: `SerpApi error: ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
