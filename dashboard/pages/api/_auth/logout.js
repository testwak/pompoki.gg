// pages/api/logout.js
export default function handler(req, res) {
    res.status(200).json({ status: 200, message: "Logged out successfully" });
  }
  