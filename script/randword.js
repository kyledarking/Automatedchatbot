const axios = require('axios');
module.exports.config = {
  name: "randword",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "Get a random word.",
  usage: "{p} randword",
  credits: "Jay Mar",//credits sa owner ng API 
  cooldown: 0,
};
module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;
  try {
    const response = await axios.get('https://lianeapi.onrender.com/api/random-word');
    const word = response.data[0];
    api.sendMessage(`💬 𝗛𝗲𝗿𝗲'𝘀 𝗬𝗼𝘂𝗿 𝗥𝗮𝗻𝗱𝗼𝗺 𝗪𝗼𝗿𝗱𝘀:\n ${word}`, threadID, messageID);
  } catch (error) {
    api.sendMessage("Sorry, I couldn't fetch a random word at the moment. Please try again later.", threadID);
  }
};
