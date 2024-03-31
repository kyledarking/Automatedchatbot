module.exports.config = {
		name: "daily",
		version: "1.0.2",
		role: 0,
		credits: "Mirai Team",
		description: "Get 20000 coins every day!",
		hasPrefix: false,
		cooldowns: 5,
		aliases: ["dai"]
};

const cooldownTime = 43200000; 
const rewardCoin = 20000;

module.exports.run = async function ({ event, api, args, Currencies }) {
		const { senderID, threadID, messageID } = event;

		let data = (await Currencies.getData(senderID)).data || {};
		if (typeof data !== "undefined" && cooldownTime - (Date.now() - (data.dailyCoolDown || 0)) > 0) {
				var time = cooldownTime - (Date.now() - data.dailyCoolDown),
						seconds = Math.floor((time / 1000) % 60),
						minutes = Math.floor((time / 1000 / 60) % 60),
						hours = Math.floor((time / (1000 * 60 * 60)) % 24);

				return api.sendMessage(`You received today's rewards, please come back after: ${hours} hours ${minutes} minutes ${seconds} seconds.`, threadID, messageID);
		} else {
				await Currencies.increaseMoney(senderID, rewardCoin);
				data.dailyCoolDown = Date.now();
				await Currencies.setData(senderID, { data });
				return api.sendMessage(`You received ${rewardCoin} coins, to continue to receive, please try again after 12 hours`, threadID, messageID);
		}
};
