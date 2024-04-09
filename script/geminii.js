module.exports.config = {
	name: "gemini",
	role: 0,
	credits: "churchill",
	description: "Talk to Gemini (conversational)",
	hasPrefix: false,
	version: "5.6.7",
	aliases: ["bard"],
	usage: "gemini [prompt]"
};

module.exports.run = async function ({ api, event, args }) {
	const axios = require("axios");
	let prompt = args.join(" "),
		url = "https://i.imgur.com/SmVaQ8D.jpeg", // default URL
		uid = event.senderID;
	if (!prompt) return api.sendMessage(`Please enter a prompt.`, event.threadID);
	api.sendTypingIndicator(event.threadID);
	try {
		const geminiApi = `https://joshweb.click/gemini`;
		const response = (await axios.get(`${geminiApi}?prompt=${prompt}&url=${url}`)).data;
		return api.sendMessage(response, event.threadID);
	} catch (error) {
		console.error(error);
		return api.sendMessage('❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that\'s causing the problem, and it might resolve on retrying.', event.threadID);
	}
};
