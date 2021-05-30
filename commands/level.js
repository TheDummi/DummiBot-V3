const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const xp = require('../data/xp.json');
const respect = require('../data/respect.json');
const check = require('../data/name.json');
const botSettings = require('../data/botSettings.json');
const { random } = require('../funcs.js');

class LevelCommand extends Command {
    constructor() {
        super('level', {
            aliases: ['level', 'rank', 'lvl'],
            category: 'stats',
            description: 'check your level!',
            args: [
                {
                    id: 'argsUser',
                    type: 'user',
                }
            ]
        })
    }

    async exec(message, args) {
        let argsUsers = args.argsUser;
        let user = message.author;
        let member = argsUsers || user;
        let color = botSettings.color;
        let embed = new Discord.MessageEmbed()
            .setColor(color)
        if (check[user.id].player == false) {
            return await message.channel.send(`${user}, you have not started your journey yet!\nStart  your journey with \`~start\``)
        }
        else {
            if (argsUsers) {
                try {
                    if (check[argsUser.id].player == false) {
                        return await message.util.send(`${user}, this user has not started their journey yet!`)
                    }
                }
                catch {
                    return await message.util.send(`${user}, this user has not started their journey yet!`)
                }
            }

            let XP = xp[member.id].xp;
            let level = xp[member.id].level;
            let respectX = respect[member.id].respect;
            let nextLevel = botSettings.nextLevel;
            let reqXp = level * nextLevel;
            let str = `> Level: ${level}\n> XP: ${XP}\n> Respect: ${respectX}`
            try {
                embed = embed
                    .setAuthor(`${member.username}'s progress`, member.displayAvatarURL({ dynamic: true }))
                    .addField('Level', "```js\n" + level + "```", true)
                    .addField('XP', "```js\n" + XP + "|" + reqXp + "```", true)
                    .addField('Next level', "```js\n" + (level + 1) + "```", true)
                    .addField('Respect', "```js\n" + respectX + "```", true)
                    .setFooter(`XP needed for next level: ${reqXp - XP}`)
                    .setTimestamp()
                return await message.util.send(embed)
            }
            catch {
                str = `> **${member}'s progress**\n> \n` + str
                let rand = random(2)
                if (rand == 0) {
                    str = str + `\n> ${user}, Did you know that this command looks better in an embed?`;
                }
                else {
                    str = str;
                }
                return await message.util.send(str)
            }
        }
    }
}

module.exports = LevelCommand;