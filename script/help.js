module.exports.run = async function ({
	api,
	event,
	enableCommands,
	args,
	Utils,
	prefix
}) {
	const input = args.join(' ');
	try {
		const eventCommands = enableCommands[1].handleEvent;
		const commands = enableCommands[0].commands;
		if (!input) {
			const page1 = commands.slice(0, Math.ceil(commands.length / 3));
			const page2 = commands.slice(Math.ceil(commands.length / 3), Math.ceil(commands.length * 2 / 3));
			const page3 = commands.slice(Math.ceil(commands.length * 2 / 3), commands.length);
			const helpMessage1 = generateHelpMessage(page1, eventCommands, prefix, 1);
			const helpMessage2 = generateHelpMessage(page2, eventCommands, prefix, 2);
			const helpMessage3 = generateHelpMessage(page3, eventCommands, prefix, 3);
			api.sendMessage(helpMessage1, event.threadID, (error, messageInfo) => {
				api.sendMessage(helpMessage2, event.threadID, (error, messageInfo) => {
					api.sendMessage(helpMessage3, event.threadID, event.messageID);
				});
			});
		} else if (!isNaN(input)) {
			const page = parseInt(input);
			const pages = 3;
			let start = (page - 1) * pages;
			let end = start + pages;
			let commandsPage = commands.slice(start, end);
			let helpMessage = generateHelpMessage(commandsPage, eventCommands, prefix, page);
			api.sendMessage(helpMessage, event.threadID, event.messageID);
		} else {
			const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];
			if (command) {
				const {
					name,
					version,
					role,
					aliases = [],
					description,
					usage,
					credits,
					cooldown,
					hasPrefix
				} = command;
				const roleMessage = role !== undefined ? (role === 0 ? '➛ Permission: user' : (role === 1 ? '➛ Permission: admin' : (role === 2 ? '➛ Permission: thread Admin' : (role === 3 ? '➛ Permission: super Admin' : '')))) : '';
				const aliasesMessage = aliases.length ? `➛ Aliases: ${aliases.join(', ')}\n` : '';
				const descriptionMessage = description ? `Description: ${description}\n` : '';
				const usageMessage = usage ? `➛ Usage: ${usage}\n` : '';
				const creditsMessage = credits ? `➛ Credits: ${credits}\n` : '';
				const versionMessage = version ? `➛ Version: ${version}\n` : '';
				const cooldownMessage = cooldown ? `➛ Cooldown: ${cooldown} second(s)\n` : '';
				const message = ` 「 Command 」\n\n➛ Name: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
				api.sendMessage(message, event.threadID, event.messageID);
			} else {
				api.sendMessage('Command not found.', event.threadID, event.messageID);
			}
		}
	} catch (error) {
		console.log(error);
	}
};

function generateHelpMessage(commands, eventCommands, prefix, page) {
	let helpMessage = `𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁 - 𝗣𝗮𝗴𝗲 ${page}:\n\n`;
	commands.forEach((cmd, index) => {
		helpMessage += `\t${index + 1}. 『 ${prefix}${cmd} 』\n`;
	});
	helpMessage += '\n𝗘𝘃𝗲𝗻𝘁 𝗟𝗶𝘀𝘁:\n\n';
	eventCommands.forEach((eventCommand, index) => {
		helpMessage += `\t${index + 1}. 『 ${prefix}${eventCommand} 』\n`;
	});
	helpMessage += `\nTo view information about a specific command, type '${prefix}help command name.'`;
	return helpMessage;
}
