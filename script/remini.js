const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
  config: {
    name: "remini",
    aliases: [],
    author: "Hazeyy/kira", // Hindi ito collab, ako kasi nag-convert :>
    version: "69",
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
  },

  onStart: async function ({ api, event }) {
    const args = event.body.split(/\s+/).slice(1); // Use slice to skip the first element
    const { threadID, messageID, messageReply } = event;
    const pathie = __dirname + `/tmp/zombie.jpg`;

    // Check if there's a message reply and if it has attachments
    if (!messageReply || !messageReply.attachments || !(messageReply.attachments[0] || args[0])) {
      api.sendMessage("┐⁠(⁠￣⁠ヘ⁠￣⁠)⁠┌ | Must reply to an image or provide an image URL.", threadID, messageID);
      return;
    }

    // Determine the photo URL from the reply or command arguments
    const photoUrl = messageReply.attachments[0] ? messageReply.attachments[0].url : args.join(" ");

    // Check if a valid photo URL is present
    if (!photoUrl) {
      api.sendMessage("┐⁠(⁠￣⁠ヘ⁠￣⁠)⁠┌ | Must reply to an image or provide an image URL.", threadID, messageID);
      return;
    }

    api.sendMessage("⊂⁠(⁠・⁠﹏⁠・⁠⊂⁠) | Please wait...", threadID, async () => {
      try {
        const response = await axios.get(`https://haze-code-merge-0f8f4bbdea12.herokuapp.com/api/try/remini?url=${encodeURIComponent(photoUrl)}`);
        const processedImageURL = response.data.image_data;

        // Fetch the processed image
        const enhancedImage = await axios.get(processedImageURL, { responseType: "arraybuffer" });

        // Save the processed image to a temporary file
        fs.writeFileSync(pathie, enhancedImage.data);

        // Send the enhanced image as a reply
        api.sendMessage({
          body: "<⁠(⁠￣⁠︶⁠￣⁠)⁠> | Image Enhanced.",
          attachment: fs.createReadStream(pathie)
        }, threadID, () => fs.unlinkSync(pathie), messageID);
      } catch (error) {
        // Handle errors gracefully
        api.sendMessage(`(⁠┌⁠・⁠。⁠・⁠)⁠┌ | Api Dead...: ${error}`, threadID, messageID);
      }
    });
  }
};
