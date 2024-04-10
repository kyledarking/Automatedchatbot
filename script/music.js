const fs = require("fs");

module.exports.config = {
    name: "music",
    version: "1.0.0",
    role: 0,
    credits: "churchill",
    description: "Play and Download music from Spotify",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["music"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { spotifydl } = global.api;
        let q = args.join(" ");
        if (!q) return api.sendMessage("[ ❗ ] - Missing title of the song", event.threadID, event.messageID);

        api.sendMessage("[ 🔍 ] Searching for “" + q + "” ...", event.threadID, async (err, info) => {
            try {
                const results = await spotifydl(q);

                if (results.status && results.result) {
                    const { title, url } = results.result;

                    const dl = (
                        await axios.get(url, { responseType: "arraybuffer" })
                    ).data;

                    const path = __dirname + "/cache/spotify.mp3";
                    fs.writeFileSync(path, Buffer.from(dl, "utf-8"));

                    api.sendMessage(
                        {
                            body: `·•———[ SPOTIFY DL ]———•·\n\nTitle: ${title}\n\nYou can download this audio by clicking this link or paste it to your browser: ${url}`,
                            attachment: fs.createReadStream(path),
                        },
                        event.threadID,
                        (err, info) => {
                            fs.unlinkSync(path);
                        }
                    );
                } else {
                    api.sendMessage("❌ | Sorry, couldn't find the requested music on Spotify.", event.threadID);
                }
            } catch (error) {
                console.error(error);
                api.sendMessage("❌ | An error occurred while processing your request.", event.threadID);
            }
        });
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ | An error occurred while processing your request.", event.threadID);
    }
};
