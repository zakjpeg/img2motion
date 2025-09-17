export const config = {
  api: {
    bodyParser: true, // parse JSON bodies
  },
};

export default async function handler(req, res) {
  // Handle preflight first
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Runway-Version"
    );
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;

    console.log("prompt:", body.promptText);
    console.log("duration:", body.duration);
    console.log("apikey", body.apikey);
    const apiKey = body.apikey;
    const promptImage = body.promptImage;
    const promptText = body.promptText;
    const duration = body.duration;
    const ratio = body.ratio;

    try {
        const result = await fetch(
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
            ).then(res => res.json())
            .then(data => {
                console.log(data);
            }
        );
    } catch (err) {
        console.log("OOPSY");
        console.log(err);
    }
    
    // Respond by reiterating the received data
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({
      message: "Data received successfully",
      receivedData: body,
    });
  } catch (err) {
    console.error("Serverless function error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
