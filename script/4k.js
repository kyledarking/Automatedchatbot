const axios = require('axios');
const fs = require('fs-extra');
const tinyurl = require("tinyurl");

module.exports.config = {
  name: "4k",
  version: "6.9",
  hasPermision: 0,
  credits: "MAHI",
  description: "Image Enhancer",
  usePrefix: false,
  usages: "Reply to a photo to enhance image",
  cooldown: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  const startsWithTrigger = (str, trigger) => str.slice(0, trigger.length) === trigger;

  if (!(startsWithTrigger(event.body, "4k") || startsWithTrigger(event.body, "HD"))) return;

  const args = event.body.split(/\s+/);
  args.shift();

  const { threadID, messageID } = event;

  const photoUrl = event.messageReply?.attachments[0]?.url || args.join(" ");

  if (!photoUrl) {
    api.sendMessage("☑️ | Please reply to a photo to proceed enhancing images...", threadID, messageID);
    return;
  }

  const finalUrl = await tinyurl.shorten(photoUrl);

  api.sendMessage("⏳ | Enhancing please wait...", threadID, async () => {
    try {
      const response = await axios.get(`https://hiroshi-api-hub.replit.app/remini/v2?url=${encodeURIComponent(finalUrl)}`);

      const ImageURL = response.data.url;
      const img = (await axios.get(ImageURL, { responseType: "arraybuffer" })).data;
      const author = response.data.author;

      const filename = __dirname + "/cache/enhanced_image.jpg";
      fs.writeFileSync(filename, Buffer.from(img, 'binary'));

      api.sendMessage({
        body: `
        ✅ | Successfully enhanced your image...
        ☑️ | Author: ${author}`,
        attachment: fs.createReadStream(filename)
      }, threadID, () => fs.unlinkSync(filename), messageID);
    } catch (error) {
      api.sendMessage(`❎ | Error while processing image: ` + error, threadID, messageID);
    }
  });
};

module.exports.run = async function ({ api, event }) {};
