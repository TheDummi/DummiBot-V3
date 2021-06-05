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

const { random, doubleXpSetter, doubleCoinsSetter } = require('../funcs.js');
const customCooldown = new Set();

class MessageListener extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message'
        });
    }

    async exec(message, args) {
        let client = this.client;
        let user = message.author;
        let color = botSettings.color;
        let prefixes = botSettings.prefixes;

        let embed = new Discord.MessageEmbed()
            .setColor(color)

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

        //! rifle, fishing rod will be in a user data...
        


        if (message.content == "<@!" + client.user.id + ">" || message.content == "<@" + client.user.id + ">") {
            let str = `My prefixes are: ${prefixes}\n\nRun \`~commands\` to get my commands.`;
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
            let xpAdd = random(xpEarn);
            let nextLvl = level * nextLevel

            let respectX = respect[user.id].respect;

            let coin = coins[user.id].coins;
            let bank = coins[user.id].bank;
            let coinsAdd = random(coinsEarn) + 1;

            let Class = profile[user.id].class;
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
            let Storage = profile[user.id].storage;
            let maxStorage = profile[user.id].maxStorage;
            
            let guildCheck = new Boolean(message.guild);
            
            let levelDm = name[user.id].levelDm;
            
            let deer = storage[user.id].deer;
            let rabbit = storage[user.id].rabbit;
            let wolf = storage[user.id].wolf;
            let ox = storage[user.id].ox;
            let raccoon = storage[user.id].raccoon;
            let bison = storage[user.id].bison;
            let crocodile = storage[user.id].crocodile;
            let skunk = storage[user.id].skunk;
            let fish = storage[user.id].fish;
            let medkit = storage[user.id].medkit;
            let bandage = storage[user.id].bandage;
            let syringe = storage[user.id].syringe;
            let doubleXp = storage[user.id].doubleXp;
            let doubleCoins = storage[user.id].doubleCoins;
            let serverBooster = storage[user.id].serverBooster;

            if (guildCheck == false) {
                return XP = XP + 0;
            }
            if (customCooldown.has(user.id)) {
                return XP = XP + 0;
            }
            else {
                if (doubleXpSetter(message)) {
                    xpAdd = xpAdd * 2;
                    console.log("double!")
                }
                XP = XP + xpAdd;
                customCooldown.add(user.id)
                setTimeout(() => {
                    customCooldown.delete(user.id)
                }, 10000);
            }
            if (doubleCoinsSetter) {
                coinsAdd = coinsAdd * 2;
            }
            coin = coin + coinsAdd;
            if (nextLvl <= XP) {
                let lvlEmbed = new Discord.MessageEmbed()
                    .setColor(color)
                let placeholder = 2
                skillPoints = skillPoints + 1
                let levelCoins = Math.round(Math.random() * (random(level) + 1) * 100);
                if (doubleCoinsSetter) {
                    levelCoins = levelCoins * 2;
                }
                coin = coin + levelCoins;
                level = level + 1
                try {
                    if (levelDm == true) {
                        let rand = random(2)
                        if (rand == 0) lvlEmbed = lvlEmbed.addField('TIP', 'You can turn off DM level up messages with `~dm`')
                        lvlEmbed = lvlEmbed
                            .setAuthor('🎉 You went level up! 🎉', user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`You earned 1 skill point, and ${levelCoins} coins!`)
                            .setFooter('Use these rewards in server.')
                            .setTimestamp()
                        user.send(lvlEmbed)
                    }
                    else {
                        lvlEmbed = lvlEmbed
                            .setAuthor(`🎉 ${user.username}, you went level up! 🎉`, user.displayAvatarURL({ dynamic: true }))
                            .setDescription(`You earned 1 skill point(s), and ${levelCoins} coins!`)
                            .setTimestamp()
                        let str = `🎉 **${user}, you went level up!** 🎉\n\nYou earned 1 skill point(s), and ${levelCoins} coins!`
                        try {
                            await message.channel.send(lvlEmbed)
                                .then(message => {
                                    setTimeout(() => {
                                        message.delete(lvlEmbed)
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
            let memberXp;
            let memberCoin;
            let member;
            let memberLevel;
            let memberBank;
            let memberDeer;
            let memberRabbit;
            let memberWolf;
            let memberOx;
            let memberRaccoon;
            let memberBison;
            let memberCrocodile;
            let memberSkunk;
            let memberFish;
            let memberMedkit;
            let memberBandage;
            let memberSyringe;
            let memberDoubleXp;
            let memberDoubleCoins;
            let memberServerBooster;
            let newUser;
            if (Math.random() < 0.05) {
                embed = embed
                    .setTitle('A chest appeared!')
                    .setImage('https://i.pinimg.com/originals/43/3d/11/433d11455ad682b75e5a2648e51b4d0a.png')
                    .setFooter('Click 🗝️ to open it!')
                let msg;
                try {
                    msg = await message.channel.send(embed)
                }
                catch {
                    msg = await message.channel.send('A random chest appeared! Click 🗝️ to open it!')
                }
                await msg.react('🗝️')
                const filter = (reaction, user) => reaction.emoji.id = '🗝️';
                let reactions = await msg.awaitReactions(filter, { max: 1 })
                newUser = reactions.first().users.cache.array().slice(1, 2)
                if (newUser) {
                    let chestCoins = random(1000) + 1;
                    member = newUser[0].id;
                    try {
                        if (name[member].player == false) {
                            await msg.delete()
                            let m = await message.channel.send(`${newUser[0]} in order to claim this chest you have to use \`~start\` first!`)
                                .then(async message => {
                                    setTimeout(async () => {
                                    await message.delete(m)
                                }, 60000)
                            })
                        }
                    }
                    catch {
                        await msg.delete()
                        let m = await message.channel.send(`${newUser[0]} in order to claim this chest you have to use \`~start\` first!`)
                        .then(async message => {
                            setTimeout(async () => {
                            await message.delete(m)
                        }, 60000)
                    })
                    }
                    let rand = random(50);
                    let randTake = random(3);
                    let xtrStr;
                    let randNum1 = 0;
                    let randNum2 = 0;
                    let randNum3 = 0;
                    if (rand == 0) {
                        if (randTake == 0) {
                            xtrStr = "You got lucky and found a double xp booster!"
                            randNum1 = randNum1 + 1;
                        }
                        else if (randTake == 1) {
                            xtrStr = "You got lucky and found a double coins booster!"
                            randNum2 = randNum2 + 1;
                        }
                        else if (randTake == 2) {
                            xtrStr = "You got lucky and found a server booster!"
                            randNum3 = randNum3 + 1;
                        }
                        else xtrStr = ""
                    }
                    if (rand == 49) {
                        if (randTake == 0) {
                            xtrStr = "You got lucky and found a double xp booster!"
                            randNum1 = randNum1 + 1;
                        }
                        else if (randTake == 1) {
                            xtrStr = "You got lucky and found a double coins booster!"
                            randNum2 = randNum2 + 1;
                        }
                        else if (randTake == 2) {
                            xtrStr = "You got lucky and found a server booster!"
                            randNum3 = randNum3 + 1;
                        }
                        else xtrStr = ""
                    }
                    if (member == message.author.id) {
                        doubleXp = doubleXp + randNum1;
                        doubleCoins = doubleCoins + randNum2;
                        serverBooster = serverBooster + randNum3;
                        XP = XP + random(1000) + 1;
                        coin = coin + chestCoins;
                    }
                    if (member != message.author.id) {
                        memberDeer = storage[member].deer;
                        memberRabbit = storage[member].rabbit;
                        memberWolf = storage[member].wolf;
                        memberOx = storage[member].ox;
                        memberRaccoon = storage[member].raccoon;
                        memberBison = storage[member].bison;
                        memberCrocodile = storage[member].crocodile;
                        memberSkunk = storage[member].skunk;
                        memberFish = storage[member].fish;
                        memberMedkit = storage[member].medkit;
                        memberBandage = storage[member].bandage;
                        memberSyringe = storage[member].syringe;
                        memberDoubleXp = storage[member].doubleXp + randNum1;
                        memberDoubleCoins = storage[member].doubleCoins + randNum2;
                        memberServerBooster = storage[member].serverBooster + randNum3;
                        memberCoin = coins[member].coins;
                        memberBank = coins[member].bank;
                        memberXp = xp[member].xp;
                        memberLevel = xp[member].level;
                        memberCoin = memberCoin + chestCoins;
                        memberXp = memberXp + random(1000) + 1;
                    }
                    await msg.delete();
                    if (xtrStr == undefined || xtrStr == "") {
                        let m = await message.channel.send(`${newUser} you opened the chest! You found: ₪ ${chestCoins}!`)
                            .then(async message => {
                                setTimeout(async () => {
                                await message.delete(m)
                            }, 60000)
                        })
                    }
                    else {
                        let m = await message.channel.send(`${newUser} you opened the chest! You found: ₪ ${chestCoins}!\n${xtrStr}`)
                            .then(async message => {
                                setTimeout(async () => {
                                await message.delete(m)
                            }, 60000)
                        })
                    }
                }
                else {
                    setTimeout(async () => {
                        await msg.delete()
                    }, 60000)
                }
            }

            xp[member] = {
                xp: memberXp,
                level: memberLevel
            }

            coins[member] = {
                coins: memberCoin,
                bank: memberBank
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
                class: profile[user.id].class,
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
                storage: Storage,
                maxStorage: maxStorage,
            }

            storage[user.id] = {
                deer:  memberDeer,
                rabbit: memberRabbit,
                wolf:  memberWolf,
                ox: memberOx,
                raccoon: memberRaccoon,
                bison: memberBison,
                crocodile: memberCrocodile,
                skunk: memberSkunk,
                fish:  memberFish,
                medkit: memberMedkit,
                bandage: memberBandage,
                syringe:memberSyringe,
                doubleXp: memberDoubleXp,
                doubleCoins: memberDoubleCoins,
                serverBooster: memberServerBooster,
            }

            storage[user.id] = {
                deer: deer,
                rabbit: rabbit,
                wolf: wolf,
                ox: ox,
                raccoon: raccoon,
                bison: bison,
                crocodile: crocodile,
                skunk: skunk,
                fish: fish,
                medkit: medkit,
                bandage: bandage,
                syringe: syringe,
                doubleXp: doubleXp,
                doubleCoins: doubleCoins,
                serverBooster: serverBooster,
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
            fs.writeFile('data/storage.json', JSON.stringify(storage), (err) => {
                if (err) console.log(err)
            });
        }
    }
};

module.exports = MessageListener;