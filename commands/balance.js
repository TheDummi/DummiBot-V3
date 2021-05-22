const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const xp = require('../data/xp.json');
const coins = require('../data/coins.json');
const botSettings = require('../data/botSettings.json');
const check = require('../data/name.json');

const { random } = require('../funcs.js');

class BalanceCommand extends Command {
    constructor() {
        super('balance', {
            aliases: ['balance', 'bal', 'credits', 'cred'],
            category: 'stats',
            description: 'check your balance!',
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
        let purple = 0XAA00CC;
        let embed = new Discord.MessageEmbed()
            .setColor(purple)
        if (check[user.id].player == false) {
            return await message.channel.send(`${user}, you have not started your journey yet!\nStart  your journey with \`~start\``)
        }
        else {
            if (argsUsers) {
                try {
                    if (check[argsUsers.id].player == false) {
                        return await message.util.send(`${user}, this user has not started their journey yet!`)
                    }
                }
                catch {
                    return await message.util.send(`${user}, this user has not started their journey yet!`)

                }
            }

            let coin = coins[member.id].coins;
            let bank = coins[member.id].bank;
            let level = xp[member.id].level;
            let maxBank = level * 1000;
            let bankSpacePercentage = Math.round(bank/maxBank * 10000) / 100 + "%"

            try {
                embed = embed
                    .setAuthor(`${member.username}'s wallet`, member.displayAvatarURL({ dynamic: true }))
                    .addField('Wallet', "₪ " + coin)
                    .addField('Bank', "₪ " + bank + "/" + maxBank + " `" + bankSpacePercentage + "`")
                    .setFooter(`Total: ₪ ${coin + bank}`)
                return await message.util.send(embed)
                }
            catch {
                let rand = random(2)
                let str = `**${member}'s Wallet**\n\nWallet: ₪ ${coin}\nBank: ₪ ${bank}/${maxBank} \`${bankSpacePercentage}\`\nTotal: ${coin + bank}`
                if (rand == 0) {
                    str = str + `\n${user} did you know that this looks better in an embed?`
                }
                else return str;
                return await message.util.send(str)
            }
        }
    }
};

module.exports = BalanceCommand;