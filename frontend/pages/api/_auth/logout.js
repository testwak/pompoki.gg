export default function handler(req, res) {
    if (req.method === "POST") {
      // Here you could clear cookies, sessions, etc.
      return res.status(200).json({ message: "Logged out successfully" });
    }
  
    return res.status(405).json({ error: "Method not allowed" });
  }
  