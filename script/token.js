const axios = require('axios');

module.exports.config = {
    name: "cookie",
    version: "1.0.0",
    description: "Get Facebook cookie using username and password.",
    usage: "{prefix}cookie <username> <password>",
    hasPrefix: true,
    credits: "Churchill",
    commandCategory: "Utility",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const username = args[0];
    const password = args[1];

    if (!username || !password) {
        return api.sendMessage("Please provide your username and password.", event.threadID, event.messageID);
    }

    try {
        api.sendMessage("Processing your request...", event.threadID, event.messageID);

        const apiUrl = `https://hiroshi-api-hub.replit.app/tool/fbtoken?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
        const response = await axios.get(apiUrl);

        const cookie = response.data.cookie;

        if (cookie) {
            api.sendMessage(`Here is your Facebook cookie:\n${cookie}`, event.threadID, event.messageID);
        } else {
            throw new Error("Failed to get Facebook cookie.");
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
};
