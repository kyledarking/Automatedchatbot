const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
    name: "remini",
    version: "69",
    author: "Hazeyy/kira",
    cooldowns: 5,
    role: 0,
    shortDescription: {
        en: "enhance image"
    },
    longDescription: {
        en: "remini filter"
    },
    category: "image",
    guide: {
        en: "{p}{n} [reply to an img]"
    }
};

module.exports.run = async function ({ api, event }) {
    const args = event.body.split(/\s+/).slice(1);
    const { threadID, messageID, messageReply } = event;
    const pathie = __dirname + `/tmp/zombie.jpg`;

    if (!messageReply || !messageReply.attachments || !(messageReply.attachments[0] || args[0])) {
        api.sendMessage("┐⁠(⁠￣⁠ヘ⁠￣⁠)⁠┌ | Must reply to an image or provide an image URL.", threadID, messageID);
        return;
    }

    const photoUrl = messageReply.attachments[0] ? messageReply.attachments[0].url : args.join(" ");

    if (!photoUrl) {
        api.sendMessage("┐⁠(⁠￣⁠ヘ⁠￣⁠)⁠┌ | Must reply to an image or provide an image URL.", threadID, messageID);
        return;
    }

    api.sendMessage("⊂⁠(⁠・⁠﹏⁠・⁠⊂⁠) | Please wait...", threadID, async () => {
        try {
            const response = await axios.get(`https://haze-code-merge-0f8f4bbdea12.herokuapp.com/api/try/remini?url=${encodeURIComponent(photoUrl)}`);
            const processedImageURL = response.data.image_data;

            const enhancedImage = await axios.get(processedImageURL, { responseType: "arraybuffer" });

            fs.writeFileSync(pathie, enhancedImage.data);

            api.sendMessage({
                body: "<⁠(⁠￣⁠︶⁠￣⁠)⁠> | Image Enhanced.",
                attachment: fs.createReadStream(pathie)
            }, threadID, () => fs.unlinkSync(pathie), messageID);
        } catch (error) {
            api.sendMessage(`(⁠┌⁠・⁠。⁠・⁠)⁠┌ | Api Dead...: ${error}`, threadID, messageID);
        }
    });
};
