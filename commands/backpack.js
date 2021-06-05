const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const botSettings = require('../data/botSettings.json');
const storage = require('../data/storage.json');
const check = require('../data/name.json');

class BackPackCommand extends Command {
    constructor() {
        super('backpack', {
            aliases: ['backpack', 'bp', 'inv', 'inventory'],
            category: 'info',
            description: 'Check what is in your backpack!',
            channel: 'guild',
            args: [
                {
                    id: 'user',
                    type: 'user',
                }
            ]
        })
    }

    async exec(message, args) {
        let argsUsers = args.user;
        let user = message.author;
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
            let member = args.user || message.author;
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${member.username}'s backpack`, member.displayAvatarURL({ dynamic: true }))
                .setColor(botSettings.color)

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
            let Storage = deer + rabbit + wolf + ox + raccoon + bison + crocodile + skunk + fish + medkit + bandage + syringe + doubleXp + doubleCoins + serverBooster;
            if (Storage > 1) {
                embed.setFooter(`You have used ${Storage} spaces`)
            }
            else {
                embed.setFooter(`You have used ${Storage} space`)
            }
            if (deer !== 0) {
                embed = embed.addField(':deer:', deer, true)
            }
            if (rabbit !== 0) {
                embed = embed.addField(':rabbit:', rabbit, true)
            }
            if (wolf !== 0) {
                embed = embed.addField(':wolf:', wolf, true)
            }
            if (ox !== 0) {
                embed = embed.addField(':ox:', ox, true)
            }
            if (raccoon !== 0) {
                embed = embed.addField(':raccoon:', raccoon, true)
            }
            if (bison !== 0) {
                embed = embed.addField(':bison:', bison, true)
            }
            if (crocodile !== 0) {
                embed = embed.addField(':crocodile:', crocodile, true)
            }
            if (skunk !== 0) {
                embed = embed.addField(':skunk:', skunk, true)
            }
            if (fish !== 0) {
                embed = embed.addField(':fish:', fish, true)
            }
            if (medkit !== 0) {
                embed = embed.addField(':medkit:', medkit, true)
            }
            if (bandage !== 0) {
                embed = embed.addField(':bandage:', bandage, true)
            }
            if (syringe !== 0) {
                embed = embed.addField(':syringe:', syringe, true)
            }
            if (doubleXp !== 0) {
                embed = embed.addField(':doubleXp:', doubleXp, true)
            }
            if (doubleCoins !== 0) {
                embed = embed.addField(':doubleCoins:', doubleCoins, true)
            }
            if (serverBooster !== 0) {
                embed = embed.addField(':serverBooster:', serverBooster, true)
            }
            return await message.util.send(embed)
        }
    }
};

module.exports = BackPackCommand;