const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "4k",
    version: "1.0.0",
    description: "Enhance an image to 4K resolution.",
    usage: "{prefix}4k [image URL]",
    hasPrefix: true,
    credits: "bingchill",
    commandCategory: "Image",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const imageUrl = args[0];

    if (!imageUrl) {
        return api.sendMessage("Please provide an image URL.", event.threadID, event.messageID);
    }

    try {
        api.sendMessage("Processing your request...", event.threadID, event.messageID);

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
