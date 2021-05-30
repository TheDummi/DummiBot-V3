const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class SayCommand extends Command {
	constructor() {
		super('say', {
			aliases: ['say',],
			category: 'owner',
			description: 'Let DummiBot Say anything',
			ownerOnly: true,
			channel: ['guild', 'dm'],
			args: [
				{
					id: 'message',
					match: 'content'
				}
			]
		})
	}

	async exec(message, args) {
		let sayMessage = args.message
			await message.delete()
			return await message.util.send(sayMessage)
    }
};

module.exports = SayCommand;