const { Command } = require('discord-akairo');
const Discord = require('discord.js');

const botSettings = require('../data/botSettings.json');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'info',
            description: 'Get bot latency.',
            ownerOnly: false,
            channel: ['guild', 'dm']
        });
    }

    async exec(message) {
        let m = await message.util.send(`pinging...`)
        const timeDiff = (m.editedAt || m.createdAt) - (message.editedAt || message.createdAt);
        let embed = new Discord.MessageEmbed()
        .setTitle('🏓 pong!')
        .addField(`| Message latency`, `\`\`\`glsl\n${timeDiff}ms.\`\`\``, true)
        .addField('| Bot latency', `\`\`\`glsl\n${Math.round(this.client.ws.ping)}ms.\`\`\``, true)
        .setColor(botSettings.color)
        try {
            await m.edit("", embed);
        }
        catch {
            await m.edit(`> __🏓 pong!__\n> **Message latency:** ${timeDiff}ms.\n> **Bot latency:** ${Math.round(this.client.ws.ping)}ms.`)
        }
    }
};

module.exports = PingCommand;
