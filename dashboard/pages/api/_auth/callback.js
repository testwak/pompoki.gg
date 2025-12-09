import axios from "axios";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const code = req.query.code;
    //console.log("OAuth callback code:", code);

    if (!code) return res.status(400).send("No code provided.");

    try {
        const params = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.DISCORD_REDIRECT_URL,
            scope: "identify guilds",
        });

        const tokenResponse = await axios.post(
            "https://discord.com/api/oauth2/token",
            params.toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const accessToken = tokenResponse.data.access_token;
        //console.log("Discord access token:", accessToken);

        const userResponse = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const user = userResponse.data;
        //console.log("Discord user data:", user);

        const jwtToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
                discriminator: user.discriminator,
                avatar: user.avatar,
                globalName: user.global_name || null,
                avatarURL: user.avatar
                    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                    : "https://cdn.discordapp.com/embed/avatars/0.png",
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        //console.log("JWT generated:", jwtToken);

        // Redirect to frontend home page with token
        res.redirect(`/?token=${jwtToken}`);
    } catch (err) {
        console.error("OAuth error:", err.response?.data || err);
        res.redirect(`/?error=auth_failed`);
    }
}
