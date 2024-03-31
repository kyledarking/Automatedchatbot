module.exports.config = {
		name: "dice",
		version: "1.0.0",
		role: 0,
		credits: "Yazky",
		description: "Roll one or more virtual dice",
		usages: "[maxBet]",
	  aliases: ["roll"],
		hasPrefix: false,
		cooldowns: 5
};

module.exports.run = async ({ api, event, args, Currencies }) => {
		const { threadID, messageID, senderID } = event;
		const maxBet = 17000;
		const betAmount = parseInt(args[0]) || 0;

		if (isNaN(betAmount) || betAmount < 0 || betAmount > maxBet) {
				return api.sendMessage(`Invalid bet amount. Please enter a number between 0 and ${maxBet}.`, threadID, messageID);
		}

		const userRoll = rollDie();
		const botRoll = rollDie();
		let resultMessage = `You got: ${numberToEmoji(userRoll)}\nYazkybot got: ${numberToEmoji(botRoll)}\n\n`;

		if (userRoll > botRoll) {
				resultMessage += `You won ₪${betAmount} with a result of ${userRoll}`;
				await Currencies.increaseMoney(senderID, betAmount);
		} else if (botRoll > userRoll) {
				resultMessage += `You lost ₪${betAmount} with a result of ${userRoll}`;
				await Currencies.decreaseMoney(senderID, betAmount);
		} else {
				resultMessage += `Both of you were tied with a result of ${userRoll}`;
		}

		api.sendMessage(resultMessage, threadID, messageID);
};
