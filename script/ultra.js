const axios = require("axios");

module.exports.config = {
    name: "ultra",
    version: "1.0.0",
    credits: "churchill",
    description: "Ask a question to the Ultra API",
    usage: "ultra <question>",
    aliases: ["ultra"],
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const question = args.join(" ");
        if (!question) return api.sendMessage("Please provide a question.", event.threadID, event.messageID);
        
        const apiUrl = `https://hazee-gemini-ultra-c1ad28d5e422.herokuapp.com/bard?question=${encodeURIComponent(question)}`;
        
        const response = await axios.get(apiUrl);
        
        const answer = response.data || "Sorry, I couldn't find an answer to that question.";
        
        const styledAnswer = "·•———[ Ultra Answer ]———•·\n\n" + "Question: " + question + "\nAnswer:\n\n" + answer;
        
        api.sendMessage(styledAnswer, event.threadID);
    } catch (error) {
        console.error("Error:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
