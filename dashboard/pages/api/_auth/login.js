export default function handler(req, res) {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const redirectUrl = process.env.DISCORD_REDIRECT_URL;
    const scope = "identify guilds";
  
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUrl
    )}&response_type=code&scope=${encodeURIComponent(scope)}`;
  
    //console.log("Redirecting to Discord OAuth:", discordAuthUrl);
    res.redirect(discordAuthUrl);
  }
  