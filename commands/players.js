const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const check = require('../data/name.json');
const { paginate } = require('../funcs.js')
const botSettings = require('../data/botSettings.json');

class PlayersCommand extends Command {
    constructor() {
        super('players', {
            aliases: ['players'],
            category: 'info',
            description: 'Check who is a player of DummiBot!',
        })
    }

    async exec(message) {
        let embeds = [];
        let keys = Object.keys(check)
        let str;
        
        for (const key of keys) {
            if (check[key].player === true) {
                str = str + `<@${key}>\n`
            }
            else {
                str = str + "";
            }
        }
        str = str.replace("undefined", "")
        // for (let i = 0; i < (str.match(/\n/g).length > 15); i++) {
        //     if (embeds <= 0) {
        //     }
        //     else {
        //         str.split()
        //         embeds++
        //     }
        // }
        for (let i = 0; i < keys.length; i++) {
            embeds[i] = new Discord.MessageEmbed()
                .setDescription(str)
                .setTitle('DummiBot players')
                .setColor(botSettings.color)
            try {
                embeds[i] = embeds[i].setThumbnail(message.guild.iconURL({ dynamic: true}))
            }
            catch {
                embeds[i] = embeds[i].setThumbnail(message.author.displayAvatarURL({ dynamic: true}))
            }
        }
        try {
            await paginate(message, embeds)
        }
        catch (e) {
            console.log(e)
            await message.util.send(`${message.author}, in order to use this command I require the \`Embed Links\` permission`)
        }
    }
}

module.exports = PlayersCommand;