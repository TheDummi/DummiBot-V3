const { Listener, Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');

const name = require('../data/name.json');
const xp = require('../data/xp.json');
const respect = require('../data/respect.json');
const coins = require('../data/coins.json');
const profile = require('../data/profile.json');
const storage = require('../data/storage.json');
const botSettings = require('../data/botSettings.json');

const { random } = require('../funcs.js');
const customCooldown = new Set();

class MessageListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message) {

        let client = this.client;
        let user = message.author;
        let purple = 0xAA00CC;

        let embed = new Discord.MessageEmbed()
            .setColor(purple)

        if (user.bot) return;

        if (!name[user.id]) {
            name[user.id] = {
                player: false,
                levelDm: true
            }
            fs.writeFile('data/name.json', JSON.stringify(name), (err) => {
                if (err) console.log(err)
            })
        }
        if (!xp[user.id]) {
            xp[user.id] = {
                xp: 0,
                level: 1
            }
        }

        if (!respect[user.id]) {
            respect[user.id] = {
                respect: 100
            }
        }
        
        if (!coins[user.id]) {
            coins[user.id] = {
                coins: 0,
                bank: 0
            }
        }

        if (!profile[user.id]) {
            profile[user.id] = {
                skillPoints: 1, // start off with 1
                maxHealth: 100, // max = 8    | 1 sp = +5
                health: 100,    // This is the amount you have.
                attack: 10,     // max = 8    | 1 sp = +5
                defense: 10,    // max = 8    | 1 sp = +5
                stamina: 200,   // This is the amount yo have
                maxStamina: 200,// max = 8    | 1 sp = +10
                dodge: 1,       // max = 50%  | 1 sp = +1%
                stealth: 1,     // max = 100% | 1 sp = +1%
                critical: 2,    // max = 300% | 1 sp = +2%
                storage: 0,     // This is the amount you have.
                maxStorage: 400 // max = 8    | 5 sp = +50
                                // 8 = infinite, sp = skillPoint(s)
            }
        }
        
        /*if (!storage[user.id]) {
            storage[user].id = {
                
            }
        }*/
        


        if (message.content == "<@!" + client.user.id + ">" || message.content == "<@" + client.user.id + ">") {
            let str = 'My prefixes are:\n`~`,\n`dummi`\n\nRun `~commands` to get my commands.';
            if (name[user.id].player == false) {
                str = str + `\n\n${user} you have not started your journey yet!\n Use \`~start\` to start your journey.`
            }
            let rand = random(2)
            embed = embed.setDescription(str)
            try {
            return await message.channel.send(embed);
            }
            catch {
                if (rand == 0) {
                str = str + "\nBy the way! By granting me the `Embed Links` permission more of my commands will look cleaner!"
                }
                else {
                str = str
                }
                return await message.channel.send(str)
            }
        }

        if (name[user.id].player == false) return;
        else {
            
            let xpEarn = botSettings.xpEarn;
            let coinsEarn = botSettings.coinsEarn;
            let nextLevel = botSettings.nextLevel;
            
            let XP = xp[user.id].xp;
            let level = xp[user.id].level;
            let xpAdd = XP + random(xpEarn) + 1;
            let nextLvl = level * nextLevel

            let respectX = respect[user.id].respect;

            let coin = coins[user.id].coins;
            let bank = coins[user.id].bank;
            let coinsAdd = coin + random(coinsEarn);

            let skillPoints = profile[user.id].skillPoints;
            let maxHealth = profile[user.id].maxHealth;
            let health = profile[user.id].health;
            let attack = profile[user.id].attack;
            let defense = profile[user.id].defense;
            let stamina = profile[user.id].stamina;
            let maxStamina = profile[user.id].maxStamina;
            let dodge = profile[user.id].dodge;
            let stealth = profile[user.id].stealth;
            let critical = profile[user.id].critical;
            let storage = profile[user.id].storage;
            let maxStorage = profile[user.id].maxStorage;
            let guildCheck = new Boolean(message.guild);
            let levelDm = name[user.id].levelDm;
            if (guildCheck == false) {
                return XP = XP + 0;
            }
            if (customCooldown.has(user.id)) {
                return XP = XP + 0;
            }
            else {
                XP = xpAdd;
                customCooldown.add(user.id)
                setTimeout(() => {
                    customCooldown.delete(user.id)
                }, 10000);
            }

            coin = coinsAdd;

            if (nextLvl <= XP) {
                let placeholder = 2
                skillPoints = skillPoints + 1
                let levelCoins = Math.round(Math.random() * (random(level) + 1) * 100);
                coin = coin + levelCoins;
                level = level + 1
                try {
                    if (levelDm == true) {
                        let rand = random(2)
                        console.log(rand)
                        if (rand == 0) embed = embed.addField('TIP', 'You can turn off DM level up messages with `~dm`')
                        embed = embed
                            .setAuthor('🎉 You went level up! 🎉', user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`You earned 1 skill point, and ${levelCoins} coins!`)
                            .setFooter('Use these rewards in server.')
                            .setTimestamp()
                        user.send(embed)
                    }
                    else {
                        embed = embed
                            .setAuthor(`🎉 ${user.username}, you went level up! 🎉`, user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`You earned 1 skill point(s), and ${levelCoins} coins!`)
                            .setTimestamp()
                        let str = `🎉 **${user}, you went level up!** 🎉\n\nYou earned 1 skill point(s), and ${levelCoins} coins!`
                        try {
                            await message.channel.send(embed)
                                .then(message => {
                                    setTimeout(() => {
                                        message.delete(embed)
                                    }, 5000);
                                });
                        }
                        catch {
                            let m = await message.channel.send(str)
                                .then(message => {
                                    setTimeout(() => {
                                        message.delete(m)
                                    }, 5000);
                                });
                        }
                    }
                }
                catch (e) {
                    console.log(e)
                }
            }

            xp[user.id] = {
                xp: XP,
                level: level
            }

            respect[user.id] = {
                respect: respectX
            }

            coins[user.id] = {
                coins: coin,
                bank: bank
            }

            profile[user.id] = {
                skillPoints: skillPoints,
                maxHealth: maxHealth,
                health: health,
                attack: attack,
                defense: defense,
                stamina: stamina,
                maxStamina: maxStamina,
                dodge: dodge,
                stealth: stealth,
                critical: critical,
                storage: storage,
                maxStorage: maxStorage,
            }

            fs.writeFile('data/xp.json', JSON.stringify(xp), (err) => {
                if (err) console.log(err)
            });
            fs.writeFile('data/respect.json', JSON.stringify(respect), (err) => {
                if (err) console.log(err)
            });
            fs.writeFile('data/coins.json', JSON.stringify(coins), (err) => {
                if (err) console.log(err)
            });
            fs.writeFile('data/profile.json', JSON.stringify(profile), (err) => {
                if (err) console.log(err)
            });
            /*fs.writeFile('data/storage.json', JSON.stringify(storage), (err) => {
                if (err) console.log(err)
            });*/
        }
    }
};

module.exports = MessageListener;