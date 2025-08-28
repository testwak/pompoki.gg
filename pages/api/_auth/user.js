// pages/api/discord-user.js
import axios from "axios"

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            status: 405,
            message: "405. Method Not Allowed",
            id: "",
            username: "",
            avatarURL: "",
            discriminator: "",
            avatar: "",
            globalName: "",
        })
    }

    const { token } = req.query
    if (!token) {
        return res.status(400).json({
            status: 400,
            message: "Missing token",
            id: "",
            username: "",
            avatarURL: "",
            discriminator: "",
            avatar: "",
            globalname: "",
        })
    }

    try {
        const { data } = await axios.get("https://discord.com/api/v10/users/@me", {
            headers: { Authorization: `Bearer ${token}` },
        })

        // Debug logging - check what Discord actually returns
        console.log("Discord API response:", data)
        console.log("Global name from Discord:", data.global_name)
        console.log("Global name type:", typeof data.global_name)

        return res.status(200).json({
            status: 200,
            message: "Token valid",
            id: data.id,
            username: data.username,
            discriminator: data.discriminator,
            avatarURL: data.avatar
                ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
                : null,
            avatar: data.avatar,
            globalname: data.global_name || null, // Handle null/undefined explicitly
        })
    } catch (err) {
        console.error("Discord API error:", err.response?.status, err.response?.data)
        return res.status(401).json({
            status: 401,
            message: "Invalid or expired token",
            id: "",
            username: "",
            avatarURL: "",
            discriminator: "",
            avatar: "",
            globalname: "",
        })
    }
}