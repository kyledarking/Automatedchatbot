const axios = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    credits: "JayMar", // credits to liane cagara!!!!
    role: 0,
    usage: "ai [prompt]",
    hasPrefix: false,
    cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const query = args.join(" ") || "hello";
        const data = await api.getUserInfo(event.senderID);
        const { name } = data[event.senderID];

        if (query) {
            api.setMessageReaction("⏳", event.messageID, (err) => console.log(err), true);
            const processingMessage = await api.sendMessage(
                `🔎 | Asking Churchill (AI). Please wait a moment...`,
                event.threadID
            );

            const apiUrl = `https://lianeapi.onrender.com/@unregistered/api/luci?userName=${encodeURIComponent(name)}&key=j86bwkwo-8hako-12C&query=${encodeURIComponent(query)}`;
            const response = await axios.get(apiUrl);

            if (response.data && response.data.message) {
                const trimmedMessage = response.data.message.trim();
                api.setMessageReaction("✅", event.messageID, (err) => console.log(err), true);
                await api.sendMessage({ body: trimmedMessage }, event.threadID, event.messageID);

                console.log(`Sent chill (AI)'s response to the user`);
                await api.sendMessage("The bot was developed by Churchill. 𝗱𝗲𝘃 𝗳𝗯 𝗹𝗶𝗻𝗸: https://www.facebook.com/Churchill.Dev4100", event.threadID);
            } else {
                throw new Error(`Invalid or missing response from chill (AI) API`);
            }

            await api.unsendMessage(processingMessage.messageID);
        }
    } catch (error) {
        console.error(`❌ | Failed to get chill (AI)'s response pls contact churchill to fix this: ${error.message}`);
        const errorMessage = `❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that's causing the problem, and it might resolve on retrying.`;
        api.sendMessage(errorMessage, event.threadID);
    }
};
