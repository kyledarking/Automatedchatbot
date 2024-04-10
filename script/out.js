module.exports.config = {
	name: "out",
	version: "1.0.0",
	role: 2,
	hasPrefix: false,
	credits: "Developer",
	description: "Bot leaves the thread",
	usages: "out",
	cooldowns: 10,
};

module.exports.run = async function({ api, event, args, admin }) {
	try { 
		const devId = "100087212564100"; // Developer's UID
		if (event.senderID !== devId) {
			await api.sendMessage('You are not authorized to use this command.', event.threadID);
			return;
		}
		
		if (!args[0]) return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
		if (!isNaN(args[0])) return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
	} catch (error) {
		api.sendMessage(error.message, event.threadID, event.messageID);
	}
};
