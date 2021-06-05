const { Command } = require('discord-akairo');
const coins = require('../data/coins.json');
const respect = require('../data/respect.json');
const fs = require('fs');
const check = require('../data/name.json');
const profile = require('../data/profile.json');
const { jsonError, random } = require('../funcs.js')
const targetCooldown = new Set()
class RobCommand extends Command {
    constructor() {
        super('rob', {
            aliases: ['rob', 'steal'],
            category: 'economy',
            description: 'Steal money from someone\'s wallet!',
            channel: 'guild',
            ratelimit: 3,
            cooldown: 300000,
            args: [
                {
                    id: 'user',
                    type: 'user',
                    prompt: {
                        start: message => `${message.author}, who would you like to steal money from??`,
                        retry: message => `${message.author}, couldn't find that user, who?`,
                        cancel: message => `${message.author}, you cancelled your rob!`,
                        ended: message => `${message.author}, retry \`~rob\``,
                        timeout: message => `${message.author}, you took too long...`
                    }
                }
            ]
        })
    }

    async exec(message, args) {
        let user = message.author;
        let member = args.user;

        if (member.bot) {
            return await message.util.reply('you can\'t steal money from bots!')
        }
        if (check[user.id].player == false) {
            return await message.util.reply('you haven\'t started your journey yet! Start your journey with `~start`')
        }
        if (member.id == user.id) {
            return await message.util.reply('nice try...')
        }
        if (respect[user.id].respect < 30) {
            return await message.util.reply('as long as you\'re respect is this low, they will suspect you to steal!')
        }
        try {
            if (!check[member.id].player || check[member.id].player == false) {
                return await message.util.reply('this user hasn\'t started their journey yet!')
            }
        }
        catch {
            return await message.util.reply('this user hasn\'t started their journey yet!')
        }
        if (targetCooldown.has(member.id)) {
            return await message.util.reply(`${member.username} is immune for now!`);
        }
        else {// user
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

            // member
            let memberSkillPoints = profile[member.id].skillPoints;
            let memberMaxHealth = profile[member.id].maxHealth;
            let memberHealth = profile[member.id].health;
            let memberAttack = profile[member.id].attack;
            let memberDefense = profile[member.id].defense;
            let memberStamina = profile[member.id].stamina;
            let memberMaxStamina = profile[member.id].maxStamina;
            let memberDodge = profile[member.id].dodge;
            let memberStealth = profile[member.id].stealth;
            let memberCritical = profile[member.id].critical;
            let memberStorage = profile[member.id].storage;
            let memberMaxStorage = profile[member.id].maxStorage;

            let coin = coins[user.id].coins;
            let bank = coins[user.id].bank;
            let memberCoins = coins[member.id].coins;
            let memberBank = coins[member.id].bank;
            let userRespect = respect[user.id].respect;

            if (Math.random() < (stealth / 100)) {
                let rand = Math.round(random(2 / 5 * memberCoins));
                coin = coin + rand;
                memberCoins = memberCoins - rand;
                userRespect = userRespect - random(10) + 5;
                try {
                    await message.util.reply(`you stole ₪ ${rand} from ${member.username}!`)
                    await member.send(`${user} stole ₪ ${rand} from you in ${message.guild.name}!`)
                }
                catch {
                    await message.util.reply(`you stole ₪ ${rand} from ${member}!`)
                }
            }
            else {
                return await message.util.reply(`you got caught!`);
            }
            coins[user.id] = {
                coins: coin,
                bank: bank
            }
    
            coins[member.id] = {
                coins: memberCoins,
                bank: memberBank
            }
    
            respect[user.id] = {
                respect: userRespect
            }
            fs.writeFile('data/respect.json', JSON.stringify(respect), (err) => {
                if (err) jsonError(err)
            })
            fs.writeFile('data/coins.json', JSON.stringify(coins), (err) => {
                if (err) jsonError(err)
            })
            await targetCooldown.add(member.id);
            setTimeout(async () => {
                await targetCooldown.delete(member.id)
            }, 3600000)
        }
    }
}

module.exports = RobCommand