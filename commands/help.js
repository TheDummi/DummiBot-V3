const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const botSettings = require('../data/botSettings.json');
class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'h'],
            category: 'help',
            description: 'Get a help message',
        })
    }

    async exec(message) {
        let user = message.author;
        let str = `Hey there ${user}! This is my help message...\n> In order to use me you have to \`~start\`. \n> If you want to see my commands use \`~commands\`. \n> \n> If you somehow managed to trigger this message without knowing my prefixes... Then send \`@${this.client.user.tag}\` to get my prefixes.!`
        let embed = new Discord.MessageEmbed()
            .setColor(botSettings.color)
            .setAuthor('Help menu', user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Hey there ${user}! This is my help message...\nIn order to use me you have to \`~start\`. \nIf you want to see my commands use \`~commands\`.\n\nIf you somehow managed to trigger this message without knowing my prefixes... Then send \`@${this.client.user.tag}\` to get my prefixes.!`            )
            .setFooter('This message will be deleted in 60 seconds.')
        try {
            return await message.util.send(embed)
                .then(message => {
                    setTimeout(() => {
                    message.delete(embed)
                }, 60000)
            })
        }
        catch {
            str = "> **Help menu**\n> \n> " + str + "\n> \n> This message will get deleted in 60 seconds."
            let msg = await message.util.send(str)
                .then(message => {
                    setTimeout(() => {
                        message.delete(msg);
                }, 60000)
            })
        }
    }
}

module.exports = HelpCommand;