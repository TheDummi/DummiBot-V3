const { Listener } = require('discord-akairo');
const Discord = require('discord.js');
class CommandCooldownListener extends Listener {
    constructor() {
        super('commandCooldown', {
            emitter: 'commandHandler',
            event: 'cooldown'
        });
    }

    async exec(message, command, cooldown) {
        let embed = new Discord.MessageEmbed()
            .setColor(0xaa00cc)
            if (cooldown < 60000) {
                embed = embed.setAuthor(`${message.author.username} you're still on ${Math.round(cooldown / 1000 )}s cooldown for ${command.id}`, message.author.displayAvatarURL( { dynamic: true } ))
                await message.util.send(embed)
                .then(message => {
                    setTimeout(function() {
                        message.delete(embed)
                    }, cooldown)
                })
            }
            else if (cooldown > 60000) {
                embed = embed.setAuthor(`${message.author.username} you're still on ${Math.round(cooldown / 1000 / 60 )}m cooldown for ${command.id}`, message.author.displayAvatarURL( { dynamic: true } ))
                await message.util.send(embed)
                .then(message => {
                    setTimeout(function() {
                        message.delete(embed)
                    }, cooldown)
                })
            }
            else if (cooldown > 3600000) {
            embed = embed.setAuthor(`${message.author.username} you're still on ${Math.round(cooldown / 1000 / 3600)}m cooldown for ${command.id}`, message.author.displayAvatarURL( { dynamic: true } ))
            await message.channel.send(embed)
            .then(message => {
                setTimeout(function() {
                    message.delete(embed)
                }, 60000)
            })
            }
            else if (cooldown > 86400000) {
                embed = embed.setAuthor(`${message.author.username} you're still on ${Math.round(cooldown / 1000 / 3600)}h cooldown for ${command.id}`, message.author.displayAvatarURL( { dynamic: true } ))
                await message.channel.send(embed)
            .then(message => {
                setTimeout(function() {
                    message.delete(embed)
                }, 60000)
        })
        }
    }
};
module.exports = CommandCooldownListener;