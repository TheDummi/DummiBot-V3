const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const profile = require('../data/profile.json');
const check = require('../data/name.json');
const botSettings = require('../data/botSettings');

const { random } = require('../funcs.js')

class ProfileCommand extends Command {
    constructor() {
        super('profile', {
            aliases: ['profile', 'p'],
            category: 'stats',
            description: 'Check your profile or someone else\'s',
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
                    if (check[argsUsers.id].player == false) {
                        return await message.util.send(`${user}, this user has not started their journey yet!`)
                    }
                }
                catch {
                    return await message.util.send(`${user}, this user has not started their journey yet!`)
                }
            }

            let skillPoints = profile[member.id].skillPoints;
            let maxHealth = profile[member.id].maxHealth;
            let health = profile[member.id].health;
            let attack = profile[member.id].attack;
            let defense = profile[member.id].defense;
            let stamina = profile[member.id].stamina;
            let maxStamina = profile[member.id].maxStamina;
            let dodge = profile[member.id].dodge;
            let stealth = profile[member.id].stealth;
            let critical = profile[member.id].critical;
            let storage = profile[member.id].storage;
            let maxStorage = profile[member.id].maxStorage;
            
            let str = `> ⏫ Skill points: ${skillPoints}\n> \n> ❤️ Health: ${health}/${maxHealth}\n> \n> ⚔️ Attack: ${attack}\n> \n> 🛡️ Defense: ${defense}\n> \n> ♾️ Stamina: ${stamina}/${maxStamina}\n> \n> ❌ Dodge: ${dodge}%\n> \n> :ninja: Stealth: ${stealth}%\n> \n> 💥 Critical: ${critical}%\n> \n> 📦 Storage: ${storage}/${maxStorage}` 
            try {
                embed = embed
                    .setAuthor(`${member.username}'s profile`, member.displayAvatarURL({ dynamic: true }))
                    .setDescription(`⏫ Skill points: ${skillPoints}\n\n❤️ Health: ${health}/${maxHealth}\n\n⚔️ Attack: ${attack}\n\n🛡️ Defense: ${defense}\n\n♾️ Stamina: ${stamina}/${maxStamina}\n\n❌ Dodge: ${dodge}%\n\n:ninja: Stealth: ${stealth}%\n\n💥 Critical: ${critical}%\n\n📦 Storage: ${storage}/${maxStorage}`);
                return await message.util.send(embed);
            }
            catch {
                str = `> **${member}'s profile**\n> \n` + str
                let rand = random(2)
                if (rand == 0) {
                    str = str + `\n> \n> ${user}, Did you know that this command looks better in an embed?`;
                }
                else {
                    str = str;
                }
                return await message.util.send(str)
            }
        } 
    }
}

module.exports = ProfileCommand;