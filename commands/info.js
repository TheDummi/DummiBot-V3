const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const botSettings = require('../data/botSettings.json');
const botInfo = require('../package.json');
const { getUptime } = require('../funcs.js');

class InfoCommand extends Command {
    constructor() {
        super('info', {
            aliases: ['info', 'i'],
            category: 'help',
            description: 'Get general info about DummiBot.',
        })
    }

    async exec(message) {
        const owners = (await Promise.all(this.client.ownerID.map(id => this.client.users.fetch(id)))).map(u => u.tag)
        const owner = this.client.users.cache.get('482513687417061376').tag;
        let user = message.author;
        let link = botSettings.inviteLink;
        let version = await botInfo.version;
        let footer = botSettings.footer;
        let uptime = getUptime(this.client).noSecUptime;
        let users = this.client.users.cache.size;
        let servers = this.client.guilds.cache.size;
        let channels = this.client.channels.cache.size;
        let color = botSettings.color;
        let portalLogo = this.client.guilds.cache.get('846697783653826631').emojis.cache.get('846699938430713877');
        let embed = new Discord.MessageEmbed()
            .setAuthor(`Bot info about ${this.client.user.username}`, user.displayAvatarURL({ dynamic: true }))
            .setFooter(footer)
            .setDescription(`Official ${this.client.user.username} info. Join the support server [here](${link}) for more info!`)
            .addField('| Credits', `Owner: ${owner}\nDevelopers: ${owners}\nDirector: Thomas Morton\nGroup: [Portal Development](${link}) ${portalLogo}`)
            .addField('| Technical info', `Version: ${version}\nLanguage: JavaScript\nDataBase: JavaScript Object Notation\nLibrary: Discord.js\nFramework: Discord-akairo`)
            .addField('| Bot info', `Users: ${users}\nServers: ${servers}\nChannels: ${channels}\nUptime: ${uptime}\nDocumentation: [click here for a full list of commands](https://github.com/TheDummi/DummiBot-V3/blob/master/README.md)`)
            .setColor(color)
        try {
            return await message.util.send(embed)
        }
        catch {
            let str = `> **Bot info about ${this.client.user.username}**\n> Official ${this.client.user.username} info. Join the support server ${link} for more info!\n> \n> **| Credits**\n> Owner: ${owner}\n> Developers: ${owners}\n> Director: Thomas Morton\n> Group: Portal Development ${portalLogo}\n> \n> **| Technical info**\n> Version: ${version}\n> Language: JavaScript\n> DataBase: JavaScript Object Notation\n> Library: Discord.js\n> Framework: Discord-akairo\n> \n> **| Bot info**\n> Users: ${users}\n> Servers: ${servers}\n> Channels: ${channels}\n> Uptime: ${uptime}\n> Documentation: https://github.com/TheDummi/DummiBot-V3/blob/master/README.md\n> \n> ${footer}`
            return await message.util.send(str)
        }
    }
}

module.exports = InfoCommand;