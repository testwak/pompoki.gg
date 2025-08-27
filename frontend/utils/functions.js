const getValidCard = (url, placeholder = "/images/card_placeholder.png") => {
    if (!url || url.includes("cdn.discordapp.com")) return placeholder;
    return url;
}

const renderDiscordEmojis = (text) => {
    if (!text) return null;
    const regex = /<(a?):(\w+):(\d+)>/g;
    const parts = [];
    let lastIndex = 0, match;

    while ((match = regex.exec(text)) !== null) {
        const [full, animated, name, id] = match;
        if (lastIndex < match.index) {
            parts.push(text.slice(lastIndex, match.index));
        }
        const ext = animated === "a" ? "gif" : "png";
        parts.push(
            <img
                key={id + match.index}
                src={`https://cdn.discordapp.com/emojis/${id}.${ext}`}
                alt={name}
                width={22}
                height={22}
                className="inline object-contain align-middle"
            />
        );
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
};

const trimImageUrl = (url) => {
    if (!url || typeof url !== "string") return "";
  
    const match = url.match(/\.(png|jpg|jpeg|gif|webp)/i);
    if (match) {
      const endIndex = url.indexOf(match[0]) + match[0].length;
      return url.substring(0, endIndex);
    }
    return url;
}

export {
    getValidCard,
    renderDiscordEmojis,
    trimImageUrl
}