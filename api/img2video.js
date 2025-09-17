export default async function handler(req, res) {
  // Handle only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Optional: handle preflight for CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(200).end();
  }

  try {
    console.log("image2video request made");
    console.log("Request body:", req.body);

    // Respond with JSON (like your Express route)
    res.setHeader("Access-Control-Allow-Origin", "*"); // optional if frontend is same domain
    res.status(200).json({ success: true, message: "got your request" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
