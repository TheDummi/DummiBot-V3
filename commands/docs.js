const got = require("got");
const Discord = require("discord.js")
const { Command } = require('discord-akairo');
const botSettings = require('../data/botSettings.json');

class DocsCommand extends Command {
	constructor() {
		super('docs', {
			aliases: ['docs'],
			category: 'owner',
			description: 'Gets methods for a class',
			ownerOnly: true,
			channel: ['guild', 'dm'],
			args: [
				{
					id: 'class',
					type: 'string',
					match: 'rest'
				}
			]
		})
	}


	async exec(message, args) {
		let color = botSettings.color;
		got.get('https://raw.githubusercontent.com/discordjs/discord.js/docs/stable.json').then(async response => {
		const body = JSON.parse(response.body)
		let classes = new Discord.Collection();
		body.classes.forEach(e => {
			classes.set(e.name, e)
		});
		let findClass = (message) => {
			return classes.find(e => e.name.toLowerCase() == args.class) || null
		};
		let c = findClass(message);
		if (c === null) {
			let embed = new Discord.MessageEmbed()
			.setTitle("Could not find that class!")
			.setDescription('discord.js click [here](https://discord.js.org/#/docs/main/stable/general/welcome)\nDiscord-Akairo [here](https://discord-akairo.github.io/#/docs/main/master/general/welcome) or [here](https://discord-akairo.github.io/#/docs/main/master/class/AkairoClient)')
			.setColor(color)
			return message.util.send(embed)
		}
		else {
			if (c.props === undefined || c.methods === undefined) {
				let embed = new Discord.MessageEmbed()
				.setTitle(c.name)
				.setDescription(`${c.description.replace("<warn>","```").replace("</warn>","```")}\n\n[Docs link](http://discord.js.org/#/docs/main/stable/class/${c.name})`)
				.setFooter("For this class either there was not a single method or there wan not a single property. This caused me to exclude both, because if it didn't it would make the programers' life much harder.")
				.setColor(color)
				return message.util.send(embed)
			}
			let props = "";
			c.props.forEach(e => {
				props = `${props}**${e.name}**: ${e.description}\n\n`
			})
			let meths = "";
			c.methods.forEach(e => {
				meths = `${meths}**${e.name}**: ${e.description}\n\n`
			})
			let embed = new Discord.MessageEmbed()
			.setTitle(c.name)
			.setDescription(`${c.description.replace("<warn>","```").replace("</warn>","```")}\n\n[Docs link](http://discord.js.org/#/docs/main/stable/class/${c.name})`)
			.addField("| Properties", props, true)
			.addField("| Methods", meths, true)
			.setColor(color)
			return message.util.send(embed).catch(e => {
				let propsSlim = "";
				c.props.forEach(e => {
					propsSlim = `${propsSlim}${e.name}\n\n`
				})
				let methsSlim = "";
				c.methods.forEach(e => {
					methsSlim = `${methsSlim}${e.name}\n\n`
				})
				let embedSlim = new Discord.MessageEmbed()
				.setTitle(c.name)
				.setDescription(`${c.description}\n\n[Docs link](http://discord.js.org/#/docs/main/stable/class/${c.name})`)
				.addField("| Properties", props, true)
				.addField("| Methods", meths, true)
				.setFooter("This response was minified to get around the discord character limit")
				.setColor(color)
				message.util.send(embedSlim).catch(e => {
					let embedSuperSlim = new Discord.MessageEmbed()
					.setTitle(c.name)
					.setDescription(`${c.description.replace("<warn>","```").replace("</warn>","```")}\n\n[Docs link](http://discord.js.org/#/docs/main/stable/class/${c.name})`)
					.setFooter("This response was super minified to get around the discord character limit")
					.setColor(color)
					message.util.send(embedSuperSlim)
				})
			})
		}
	});
}
};

module.exports = DocsCommand;