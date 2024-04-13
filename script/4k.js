const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "4k",
    version: "1.0.0",
    description: "Enhance an image to 4K resolution.",
    usage: "{prefix}4k [reply to an image]",
    hasPrefix: true,
    credits: "bingchill",
    commandCategory: "Image",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    // Check if the message is a reply to an image
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
        return api.sendMessage("Please reply to an image.", event.threadID, event.messageID);
    }

    try {
        api.sendMessage("Processing your request...", event.threadID, event.messageID);

        // Get the URL of the replied image
        const imageUrl = event.messageReply.attachments[0].url;

        const apiUrl = `https://hiroshi-api-hub.replit.app/remini/v1?url=${encodeURIComponent(imageUrl)}`;
        const response = await axios.get(apiUrl);

        const processedImageUrl = response.data.url;
        const imageBuffer = await axios.get(processedImageUrl, { responseType: "arraybuffer" });

        const tmpPath = __dirname + `/tmp/4k_${Date.now()}.jpg`;
        fs.writeFileSync(tmpPath, Buffer.from(imageBuffer.data, "binary"));

        api.sendMessage({
            body: "Here is your image enhanced to 4K resolution:",
            attachment: fs.createReadStream(tmpPath)
        }, event.threadID, () => fs.unlinkSync(tmpPath), event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
};
