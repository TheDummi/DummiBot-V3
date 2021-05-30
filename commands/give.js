const { Command } = require('discord-akairo');
const coins = require('../data/coins.json');
const respect = require('../data/respect.json');
const fs = require('fs');
const check = require('../data/name.json');
const { jsonError, random } = require('../funcs.js')

class GiveCommand extends Command {
    constructor() {
        super('give', {
            aliases: ['give'],
            category: 'economy',
            description: 'Give money to someone else!',
            channel: 'guild',
            args: [
                {
                    id: 'user',
                    type: 'user',
                    prompt: {
                        start: message => `${message.author}, who would you like to give money?`,
                        retry: message => `${message.author}, couldn't find that user, who?`,
                        cancel: message => `${message.author}, you cancelled your gift!`,
                        ended: message => `${message.author}, retry \`~gift\``,
                        timeout: message => `${message.author}, you took too long...`
                    }
                },
                {
                    id: 'amount',
                    type: 'number',
                    prompt: {
                        start: message => `${message.author}, how much would you like to gift?`,
                        retry: message => `${message.author}, That's not a valid amount, how much?`,
                        cancel: message => `${message.author}, you cancelled your gift!`,
                        ended: message => `${message.author}, retry \`~gift\``,
                        timeout: message => `${message.author}, you took too long...`
                    }
                }
            ]
        })
    }

    async exec(message, args) {
        let user = message.author;
        let member = args.user;
        let amount = args.amount;
        if (member.bot) {
            return await message.util.reply('you can\'t give money to bots!')
        }
        if (check[user.id].player == false) {
            return await message.util.reply('you haven\'t started your journey yet! Start your journey with `~start`')
        }
        if (member.id == user.id) {
            return await message.util.reply('nice try...')
        }
        try {
            if (!check[member.id].player || check[member.id].player == false) {
                return await message.util.reply('this user hasn\'t started their journey yet!')
            }
        }
        catch {
            return await message.util.reply('this user hasn\'t started their journey yet!')
        }
        let coin = coins[user.id].coins;
        let bank = coins[user.id].bank;
        let memberCoins = coins[member.id].coins;
        let memberBank = coins[member.id].bank;
        let userRespect = respect[user.id].respect;

        if (amount > coin) {
            return await message.util.reply('you don\'t have that amount in your wallet!');
        }
        else {
            coin = coin - amount;
            memberCoins = memberCoins + amount;
            userRespect = userRespect + random(5) + 1
            
            try {
                await message.util.reply(`you gave ${member.username} ₪ ${amount}!`)
                await member.send(`${user}, gave you ₪ ${amount}, in ${message.guild.name}`)
            }
            catch {
                await message.util.reply(`you gave ${member} ₪ ${amount}!`)
            }
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

        fs.writeFile('data/coins.json', JSON.stringify(coins), (err) => {
            if (err) jsonError()
        })
        fs.writeFile('data/respect.json', JSON.stringify(respect), (err) => {
            if (err) jsonError()
        })
    }
}

module.exports = GiveCommand;
