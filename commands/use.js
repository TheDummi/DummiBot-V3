const { Command } = require('discord-akairo');
const { doubleXpSet, doubleCoinsSet } = require('../funcs.js');

const fs = require('fs');

const storage = require('../data/storage.json');
const profile = require('../data/profile.json');

class UseCommand extends Command {
    constructor() {
        super('use', {
            aliases: ['use'],
            category: 'economy',
            description: 'Use any items you have in your back pack!',
            channel: ['guild'],
            ownerOnly: false,
            args: [
                {
                    id: 'message',
                    type: ['xpbooster', 'coinsbooster', 'serverbooster', 'medkit', 'bandage', 'syringe'],
                    prompt: {
                        start: message => `${message.author}, what would you like to use?`
                    }
                },
                {
                    id: 'amount',
                    type: 'number',
                    default: 1
                }
            ]
        })
    }
    
    async exec(message, args) {
        let skillPoints = profile[message.author.id].skillPoints;
        let maxHealth = profile[message.author.id].maxHealth;
        let health = profile[message.author.id].health;
        let attack = profile[message.author.id].attack;
        let defense = profile[message.author.id].defense;
        let stamina = profile[message.author.id].stamina;
        let maxStamina = profile[message.author.id].maxStamina;
        let dodge = profile[message.author.id].dodge;
        let stealth = profile[message.author.id].stealth;
        let critical = profile[message.author.id].critical;
        let Storage = profile[message.author.id].storage;
        let maxStorage = profile[message.author.id].maxStorage;

        let deer = storage[message.author.id].deer;
        let rabbit = storage[message.author.id].rabbit;
        let wolf = storage[message.author.id].wolf;
        let ox = storage[message.author.id].ox;
        let raccoon = storage[message.author.id].raccoon;
        let bison = storage[message.author.id].bison;
        let crocodile = storage[message.author.id].crocodile;
        let skunk = storage[message.author.id].skunk;
        let fish = storage[message.author.id].fish;
        let medkit = storage[message.author.id].medkit;
        let bandage = storage[message.author.id].bandage;
        let syringe = storage[message.author.id].syringe;
        let doubleXp = storage[message.author.id].doubleXp;
        let doubleCoins = storage[message.author.id].doubleCoins;
        let serverBooster = storage[message.author.id].serverBooster;
        
        let option = args.message;
        let amount = args.amount;
        
        if (option == 'xpbooster') {
            if (doubleXp >= 1) {
                doubleXpSet(message)
                doubleXp = doubleXp - amount;
                await message.util.reply('you used a double xp booster!')
            }
            else {
                return message.util.reply('you don\'t have a double xp booster!')
            }
        }
        if (option == 'coinsbooster') {
            if (doubleCoins >= 1) {
                doubleCoinsSet(message)
                doubleCoins = doubleCoins - amount;
                await message.util.reply('you used a double coins booster!')
            }
            else {
                return message.util.reply('you don\'t have a double coins booster!');
            }
        }
        if (option == 'medkit') {
            if (health >= maxHealth) return message.util.reply('you are at full health!');
            if (health <= 0) return message.util.reply('you need to use a revive first!');
            else {
                if (health + (250 * amount) >= maxHealth) {
                    health = maxHealth;
                    await message.util.reply('you are fully healed!')
                }
                else {
                    health = health + (250 * amount);
                    await message.util.reply(`you healed. you're now at ${health}/${maxHealth}!`)
                }
                medkit = medkit - amount;
            }
        }
        if (option == 'bandage') {
            if (health >= maxHealth) return message.util.reply('you are at full health!');
            if (health <= 0) return message.util.reply('you need to use a revive first!');
            else {
                if (health + (50 * amount) >= maxHealth) {
                    health = maxHealth;
                    await message.util.reply('you are fully healed!')
                }
                else {
                    health = health + (50 * amount);
                    await message.util.reply(`you healed. you're now at ${health}/${maxHealth}!`)
                }
                bandage = bandage - amount;
            }
        }
        if (option == 'syringe') {
            if (health >= maxHealth) return message.util.reply('you are at full health!');
            if (health >= 1) return message.util.reply('you are not dead.');
            if (amount > 1) return await message.util.reply('you can only use 1 syringe at a time!')
            else {
                health = health + (Math.round(maxHealth / 2));
                syringe = syringe - 1;
                await message.util.reply(`you revived yourself! You are at ${health}/${maxHealth}!`)
            }
        }
        storage[message.author.id] = {
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
        profile[message.author.id] = {
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
        fs.writeFile('data/profile.json', JSON.stringify(profile), (err) => {
            if (err) jsonError(err)
        })
        fs.writeFile('data/storage.json', JSON.stringify(storage), (err) => {
            if (err) jsonError(err)
        })
    }
};

module.exports = UseCommand;