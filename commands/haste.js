const got = require("got")
const fs = require("fs")
const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const botSettings = require('../data/botSettings.json');

class HasteCommand extends Command {
    constructor() {
        super('haste', {
            aliases: ['haste', 'get'],
            category: 'owner',
            description: 'Get bot code',
            ownerOnly: true,
            channel: ['guild', 'dm'],
			args: [
				{
					id: 'message',
					type: 'string',
					match: 'rest',
					prompt: {
						start: 'What path would you like to find?'
					}
				}
			]
        });
    }

	async exec(message, args) {
		let embed = new Discord.MessageEmbed()
			.setTitle(`${args.message}`)
			.setColor(botSettings.color)
		let b;
		try {
			b = fs.readFileSync(args.message)
		}
		catch {
			return await message.reply("Not a valid file path")
		}
		const {body} = await got.post('https://hst.sh/documents', {
				body: b
		});
			embed = embed.setURL(`https://hst.sh/${JSON.parse(body).key}.js`)
		if (b.length > 2048) {
			embed = embed.setDescription('Code is too long to display in an embed click the link in the title!')
				
				message.util.send(embed);
			}
			else {
				embed = embed.setDescription('```js\n' + b + '```')
			message.util.send(embed)
		}
	}
}

module.exports = HasteCommand;