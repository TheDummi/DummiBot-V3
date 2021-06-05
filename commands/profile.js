const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const profile = require('../data/profile.json');
const check = require('../data/name.json');
const botSettings = require('../data/botSettings');
const storage = require('../data/storage.json');

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

            let subClass = profile[member.id].class;
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
            let Storage = profile[member.id].storage;
            let maxStorage = profile[member.id].maxStorage;

            let deer = storage[member.id].deer;
            let rabbit = storage[member.id].rabbit;
            let wolf = storage[member.id].wolf;
            let ox = storage[member.id].ox;
            let raccoon = storage[member.id].raccoon;
            let bison = storage[member.id].bison;
            let crocodile = storage[member.id].crocodile;
            let skunk = storage[member.id].skunk;
            let fish = storage[member.id].fish;
            let medkit = storage[member.id].medkit;
            let bandage = storage[member.id].bandage;
            let syringe = storage[member.id].syringe;
            let doubleXp = storage[member.id].doubleXp;
            let doubleCoins = storage[member.id].doubleCoins;
            let serverBooster = storage[member.id].serverBooster;
            Storage = deer + rabbit + wolf + ox + raccoon + bison + crocodile + skunk + fish + medkit + bandage + syringe + doubleXp + doubleCoins + serverBooster;
            
            let str = `> ⚛️ Subclass: ${subClass}\n\n > ⏫ Skill points: ${skillPoints}\n> \n> ❤️ Health: ${health}/${maxHealth}\n> \n> ⚔️ Attack: ${attack}\n> \n> 🛡️ Defense: ${defense}\n> \n> ♾️ Stamina: ${stamina}/${maxStamina}\n> \n> ❌ Dodge: ${dodge}%\n> \n> :ninja: Stealth: ${stealth}%\n> \n> 💥 Critical: ${critical}%\n> \n> 📦 Storage: ${Storage}/${maxStorage}` 
            try {
                embed = embed
                    .setAuthor(`${member.username}'s profile`, member.displayAvatarURL({ dynamic: true }))
                    .setDescription(`⚛️ Subclass: ${subClass}\n\n ⏫ Skill points: ${skillPoints}\n\n❤️ Health: ${health}/${maxHealth}\n\n⚔️ Attack: ${attack}\n\n🛡️ Defense: ${defense}\n\n♾️ Stamina: ${stamina}/${maxStamina}\n\n❌ Dodge: ${dodge}%\n\n:ninja: Stealth: ${stealth}%\n\n💥 Critical: ${critical}%\n\n📦 Storage: ${Storage}/${maxStorage}`);
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