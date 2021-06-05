const {paginate, randColor} = require("../funcs.js");
const { Command, AkairoModule } = require('discord-akairo');
const botSettings = require('../data/botSettings.json');
const Discord = require("discord.js");
const names = {
	'start' 	: 'Starter commands',
	'economy'	: 'Economy commands',
	'stats'		: 'Stats commands',
	'help'		: 'Help commands',
	'owner'     : 'Developer commands',
	'admin'		: 'Admin commands',
	'info'		: 'Info commands'
}
const nameWeight = {
	'start'		: 0,
	'economy'	: 1,
	'stats'		: 2,
	'help'      : 3,
	'admin'		: 4,
	'info'		: 5,
	'owner'		: 6
}
class CommandsCommand extends Command {
	constructor() {
		super('commands', {
			aliases: ['commands', 'cmd', 'command'],
			category: 'help',
			description: 'Get this message.',
			ownerOnly: false,
			channel: ['guild', 'dm']
		});
	}

	async exec(message) {
		const owners = (await Promise.all(this.client.ownerID.map(id => this.client.users.fetch(id)))).map(u => u.tag)
		let categories = [];
		let embeds = [];
		let runnableCommands = [];
		this.handler.modules.forEach(e => {
			if (!categories.includes(e.category.id)) {
				categories.push(e.category.id)
			}
			if (e.ownerOnly) {
				if (this.client.ownerID.includes(message.author.id)) {
					return runnableCommands.push(e)
				}
				else {
					return;
				}
			}
			else {
				runnableCommands.push(e)
			}
		});
		categories = categories.sort((a, b) => {
			return nameWeight[a] - nameWeight[b];
		})
		let niceCategories = "";
		let color = botSettings.color;
		for (let i = 0; i < categories.length; i++) {
			embeds[i] = new Discord.MessageEmbed()
			.setTitle(names[categories[i]] || categories[i])
			.setColor(color)
			try {
				embeds[i] = embeds[i].setThumbnail(message.guild.iconURL({ dynamic: true }))
			}
			catch {
				embeds[i] = embeds[i].setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			}
			for (const item of this.handler.modules.filter(e => e.category.id === categories[i]).sort().array()) {
				if (!runnableCommands.includes(item)) continue;
				try {
					embeds[i].addField(item.aliases[0], item.description.toString(), true)
				} catch {
					embeds[i].addField(item.aliases[0], "ERROR", true)
				}
				
			}
		}
		for (const e of embeds) {
			if (e.fields.length == 0) {
				let i = embeds.indexOf(e)
				embeds.splice(i, 1);
			}
		}
		niceCategories = niceCategories + "**Page 1:** Categories list\n\n"
		embeds.forEach((e, i) => {
			niceCategories = niceCategories + `**Page ${i+2}:** ${e.title}\n\n`
		});
		let firstEmbed = new Discord.MessageEmbed() 
			.setTitle("Command categories")
			.setDescription(niceCategories)
			.setColor(color)
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
		embeds.unshift(firstEmbed)
		try {
			await paginate(message, embeds)
		}
		catch {
			await message.util.reply('in order to use this command I require the `Embed Links` permission');
		}
	}
};

module.exports = CommandsCommand;