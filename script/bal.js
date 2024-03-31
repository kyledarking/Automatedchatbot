module.exports.config = {
		name: "bal",
		version: "1.0.2",
		role: 0,
		credits: "Mirai Team",
		description: "Check the amount of yourself or the person tagged",
		usage: "[Tag]",
	hasPrefix: false,
		cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Currencies }) {
		const { threadID, messageID, senderID, mentions } = event;

		if (!args[0]) {
				const money = (await Currencies.getData(senderID)).money;
				return api.sendMessage(`Your current balance: ${money}`, threadID, messageID);
		} else if (Object.keys(mentions).length == 1) {
				const mention = Object.keys(mentions)[0];
				let money = (await Currencies.getData(mention)).money || 0;
				return api.sendMessage(`@${mentions[mention]} current balance: ${money}`, threadID, messageID);
		} else {
				return api.sendMessage(`Invalid usage. Use ${this.config.name} to check your balance or tag someone to check their balance.`, threadID, messageID);
		}
};
