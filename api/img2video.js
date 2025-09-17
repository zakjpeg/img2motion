export const config = {
  api: {
    bodyParser: true, // make sure JSON bodies are parsed
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Runway-Version");
    return res.status(200).end();
  }

  try {
    console.log("got a request...");
    const body = req.body;

    // Extract the API key from the frontend request
    const apiKey = body.apiKey;
    const promptImage = body.promptImage;
    const promptText = body.promptText;
    const duration = body.duration;
    const ratio = body.ratio;
    if (!apiKey) return res.status(400).json({ error: "Missing API key" });

    // Forward request to RunwayML
    const response = await fetch(
        "https://api.dev.runwayml.com/v1/image_to_video",
        {
            method: "POST",
            headers: {
            "Authorization": `Bearer ${apiKey}`,
            "X-Runway-Version": "2024-11-06",
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            "promptImage": promptImage,
            "seed": 4294967295,
            "model": "gen4_turbo",
            "promptText": promptText,
            "duration": duration,
            "ratio": ratio,
            "contentModeration": {
                "publicFigureThreshold": "auto"
            }
            }),
        },
        )

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(response.status).json(data);

  } catch (err) {
    console.error("Serverless function error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
