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

    // Simple validation
    if (!body) return res.status(400).json({ error: "No data received" });

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
