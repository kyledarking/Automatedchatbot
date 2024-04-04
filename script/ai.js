const { get } = require('axios');
let url = "https://deku-rest-api.replit.app";

module.exports.config = {
    name: "Ai",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    credits: "Deku",
    description: "Talk to AI with continuous conversation.",
    aliases: [],
    usages: "[prompt]",
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    function sendMessage(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (!args[0]) return sendMessage('Please provide a question first.');

    const prompt = args.join(" ");

    try {
        const response = await get(`${url}/gpt3?prompt=${encodeURIComponent(prompt)}&uid=${event.senderID}`);
        const data = response.data;
        const finalMessage = `${data}\n\n𝘁𝗵𝗲 𝗯𝗼𝘁 𝘄𝗮𝘀 𝗰𝗿𝗲𝗮𝘁𝗲 𝗯𝘆 𝗰𝗵𝘂𝗿𝗰𝗵𝗶𝗹𝗹 𝗽𝗼𝗴𝗶\n𝗗𝗲𝘃 𝗹𝗶𝗻𝗸: https://www.facebook.com/profile.php?id=100087212564100`;
        return sendMessage(finalMessage);
    } catch (error) {
        return sendMessage(error.message);
    }
}
