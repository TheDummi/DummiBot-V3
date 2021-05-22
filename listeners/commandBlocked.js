const { Listener } = require('discord-akairo');
const Discord = require('discord.js');
class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        });
    }

    async exec(message, command, reason) {
        const channel = this.client.channels.cache.get('805529461394112542')
        
        let embed = new Discord.MessageEmbed()
        .setTitle('Command block traceback')
        .setColor(0xaa00cc)
        .addField('Author', message.author.tag)
        if (message.guild !== null) {
            embed = embed.addField('Server', message.guild.name)
        }
        try {
            if (message.channel.id !== undefined) {
                let invite = message.channel.createInvite()
                let invited = await invite
                embed = embed.addField('Direct link', `[click me](${invited})`)
            }
        }
        catch {
            embed = embed.addField('Server link', 'No server link permission or in a DM')
        }
        embed
            .addField('Command', command.id)
        if (reason == "owner") {
            embed = embed.addField('Reason', `Not an ${reason}`)
            await message.channel.send(`<@${message.author.id}> you are not a developer. \`${command.id}\` is a developer command.`)
        }
        if (reason == "dm") {
            embed = embed.addField('Reason', `Not in a DM`)
            await message.channel.send(`<@${message.author.id}> you can only use \`${command.id}\` in DMs.`)
        }
        if (reason == "guild") {
            embed = embed.addField('Reason', `Not in a guild`)
            await message.channel.send(`<@${message.author.id}> you can only use \`${command.id}\` in guilds.`)
        }
        await channel.send(embed)
    }
};
module.exports = CommandBlockedListener;