const COOLDOWN_TIME = 18000000; // 5 minutes in milliseconds

module.exports.config = {
		name: "work",
		version: "1.0.1",
		role: 0,
		credits: "Mirai Team",
		description: "If you work, you can eat!",
		aliases: ["wo"],
		cooldowns: 0,
		hasPrefix: false,
};

module.exports.run = async function ({ event, api, Currencies }) {
		const { threadID, messageID, senderID } = event;

		const cooldown = COOLDOWN_TIME;
		const userData = await Currencies.getData(senderID);

		if (userData && userData.workTime && cooldown - (Date.now() - userData.workTime) > 0) {
				const time = cooldown - (Date.now() - userData.workTime);
				const minutes = Math.floor(time / 60000);
				const seconds = ((time % 60000) / 1000).toFixed(0);

				return api.sendMessage(`You have worked today, to avoid exhaustion please come back after: ${minutes} minute(s) ${seconds < 10 ? "0" + seconds : seconds} second(s).`, threadID, messageID);
		} else {
				const jobs = [
						"sell lottery tickets",
						"repair car",
						"programming",
						"hack Facebook",
						"chef",
						"mason",
						"fake taxi",
						"gangbang someone",
						"plumber ( ͡° ͜ʖ ͡°)",
						"streamer",
						"online seller",
						"housewife",
						'sell "flower"',
						"find jav/hentai code for SpermLord",
						"play Yasuo and carry your team"
				];
				const amount = Math.floor(Math.random() * 600);
				const jobIndex = Math.floor(Math.random() * jobs.length);
				const job = jobs[jobIndex];

				await Currencies.increaseMoney(senderID, amount);
				await Currencies.setData(senderID, { money: (userData?.money || 0) + amount, workTime: Date.now() });

				return api.sendMessage(`You did the job: ${job} and received: ${amount}$`, threadID, messageID);
		}
};
