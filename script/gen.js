const axios = require('axios');
const fs = require('fs');

module.exports.config = {
	name: "gen",
	version: "25.0.0",
	hasPrefix: false,
	role: 0,
	description: "Generate image",
	usages: "[text]",
	credits: "Deku",
	aliases: ["gen"]
};

module.exports.run = async function ({ api, event, args }) {
	let t = args.join(" ");
	if (!t) return api.sendMessage('Missing prompt!', event.threadID, event.messageID);
	api.sendMessage('Processing request...', event.threadID, event.messageID);

	try {
		const response = await axios.get(`https://hiroshi-api-hub.replit.app/ai/imagegen?q=${encodeURIComponent(t)}`);
		const imageUrl = response.data.url;

		const imageStream = await axios.get(imageUrl, { responseType: 'stream' });

		const pathh = __dirname + "/cache/generated.png";
		const writer = fs.createWriteStream(pathh);
		imageStream.data.pipe(writer);

		writer.on('finish', () => {
			console.log('Downloaded');
			api.sendMessage({
				body: "Here's the generated image",
				attachment: fs.createReadStream(pathh)
			}, event.threadID, () => fs.unlinkSync(pathh), event.messageID);
		});
	} catch (error) {
		console.error(error);
		api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
	}
};
