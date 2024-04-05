const axios = require("axios");

module.exports.config = {
    name: "gemini",
    version: "1.0.0",
    credits: "Churchill Pogi", 
    role: 0,
    description: "Gets a response from the Gemini API.",
    usage: "gemini [query]",
    hasPrefix: false,
    cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const query = args.join(" ");
        const model = "bard"; // You can change the model here
        const apiUrl = `https://jerai.onrender.com/chat?query=${encodeURIComponent(query)}&model=${model}`;
        const response = await axios.get(apiUrl);

        if (response.data && response.data.message) {
            const geminiResponse = response.data.message;
            api.sendMessage(geminiResponse, event.threadID);
            console.log(`Sent Gemini API response to user: ${geminiResponse}`);
        } else {
            throw new Error(`Invalid or missing response from the Gemini API`);
        }
    } catch (error) {
        console.error(`❌ | Failed to get Gemini API response: ${error.message}`);
        const errorMessage = `❌ | An error occurred while fetching the Gemini API response. Please try again later.`;
        api.sendMessage(errorMessage, event.threadID);
    }
};
