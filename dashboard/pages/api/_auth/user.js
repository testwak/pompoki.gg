import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: 405, message: "Method Not Allowed" });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ status: 400, message: "No token provided" });
  }

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      status: 200,
      message: "Token valid",
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      avatarURL: userData.avatarURL,
      globalName: userData.globalName || null,
    });
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ status: 401, message: "Invalid or expired token" });
  }
}
