const axios = require('axios');

module.exports.config = {
    name: "fbcover",
    version: "1.0.0",
    description: "Generate a Facebook cover with custom details.",
    usage: "{prefix}fbcover <name> <id> <subname> <color>",
    hasPrefix: true,
    credits: "chill",
    commandCategory: "Image",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const name = args[0];
    const id = args[1];
    const subname = args[2];
    const color = args[3];

    if (!name || !id || !subname || !color) {
        return api.sendMessage("Please provide the name, ID, subname, and color.", event.threadID, event.messageID);
    }

    try {
        api.sendMessage("Processing your request...", event.threadID, event.messageID);

        const apiUrl = `https://hiroshi-api-hub.replit.app/canvas/fbcoverv1?name=${encodeURIComponent(name)}&id=${encodeURIComponent(id)}&subname=${encodeURIComponent(subname)}&color=${encodeURIComponent(color)}`;
        const response = await axios.get(apiUrl);

        const coverUrl = response.data.url;

        if (coverUrl) {
            api.sendMessage({
                body: "Here is your Facebook cover:",
                attachment: coverUrl
            }, event.threadID, event.messageID);
        } else {
            throw new Error("Failed to generate Facebook cover.");
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
};
