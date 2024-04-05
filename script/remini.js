const axios = require("axios");

module.exports.config = {
    name: "remini",
    version: "1.0.0",
    credits: "Churchill Pogi", 
    role: 0,
    description: "Gets a Reminiscence from the API.",
    usage: "remini [input]",
    hasPrefix: false,
    cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const input = args.join(" ");
        const apiUrl = `https://markdevsapi-2014427ac33a.herokuapp.com/remini?input=${encodeURIComponent(input)}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.message) {
            const reminiscence = response.data.message;
            api.sendMessage(reminiscence, event.threadID);
            console.log(`Sent Reminiscence to user: ${reminiscence}`);
        } else {
            throw new Error(`Invalid or missing response from the Reminiscence API`);
        }
    } catch (error) {
        console.error(`❌ | Failed to get Reminiscence: ${error.message}`);
        const errorMessage = `❌ | An error occurred while fetching the Reminiscence. Please try again later.`;
        api.sendMessage(errorMessage, event.threadID);
    }
};
