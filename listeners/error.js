const { Listener } = require('discord-akairo');
const Discord = require('discord.js')
class ErrorListener extends Listener {
    constructor() {
        super('error', {
            emitter: 'commandHandler',
            event: 'error'
        });
    }

    async exec(error, message, command) {
        const tracebackChannel = this.client.channels.cache.get('805529461394112542')
        const logsChannel = this.client.channels.cache.get("787659536710238238")
        let errorEmbed = new Discord.MessageEmbed()
        .setDescription(`\`\`\`js\n${error.stack}\`\`\``)
        .setColor(0xaa00cc)
        let m = await logsChannel.send(errorEmbed)
        let reason = error.message
        let embed = new Discord.MessageEmbed()
        .setTitle('Command error traceback')
        .setColor(0xAA00CC)
        .addField('Author', message.author.username)
        if (message.guild !== null) {
            embed = embed.addField('Server', message.guild.name)
        } 
        try {
            if (message.channel.id !== undefined) {
                let invite = message.channel.createInvite()
		        let invited = await invite
                embed = embed.addField('Server link', `[${message.guild.name}](${invited})`)
            }
        }
        catch {
            embed = embed.addField('Server link','No server invite permission or in DM.')
        }
        embed
            .addField('Error log', `[${command.id}](${m.url})`)
            .addField('Command', command.id)
            .addField('Reason', reason)
        await tracebackChannel.send(embed)
        let embedError = new Discord.MessageEmbed()
		.setTitle(`There was an error trying to execute ${command.id}!`)
		.setDescription('Your error got logged in the support server.\nPlease join the support server [here](https://discord.gg/ET4yckcD78) for more information.')
		.setColor(0xaa00cc)
		await message.util.send(embedError)
        .then(message => {
            setTimeout(function() {
                message.delete(embedError)
            }, 60000)
        })
    }
}
module.exports = ErrorListener;