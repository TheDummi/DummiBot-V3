const { Command, Argument } = require('discord-akairo');
const coins = require('../data/coins.json');
const { random, jsonError } = require('../funcs.js');
const fs = require('fs');
const check = require('../data/name.json');

class GambleCommand extends Command {
    constructor() {
        super('gamble', {
            aliases: ['gamble'],
            category: 'economy',
            description: 'Gamble your money.',
            channel: 'guild',
            ratelimit: 10,
            cooldown: 3600000,
            args: [
                {
                    id: 'amount',
                    type: Argument.union('all', 'number'),
                    prompt: {
                        start: message => `${message.author} how much would you like to gamble?`,
                        retry: message => `${message.author}, respond with a valid amount or \`all\´.`,
                        cancel: message => `${message.author}, you cancelled your betting!`,
                        ended: message => `${message.author}, I couldn't register your betting...`,
                        timeout: message => `${message.author} I have no time to be waiting on you to answer...`
                    }
                }
            ]
        })
    }

    async exec(message, args) {
        if (check[message.author.id].player == false) return message.util.send(`${message.author}, you have not started your journey yet!`)
        let user = message.author;
        let amount = args.amount;
        let coin = coins[user.id].coins;
        let bank = coins[user.id].bank;
        if (amount == 'number') {
            amount = Number(amount);
            amount = amount
        }
        else if (amount == 'all') {
            amount = Number(amount);
            amount = coin
        }
        if (coin <= 0) return message.util.reply('You can\'t gamble when you have no money in your pockets!');
        if (isNaN(amount)) return message.util.reply('the given amount is invalid!');
        if (amount > coin) return message.util.reply('you don\'t have that amount in your wallet!');
        if (amount <= 0) return message.util.reply('you can\'t gamble lower than 0!');
        
        let rand = random(6);
        let num;
        if (rand == 0) {
            num = coin - amount;
            coin = num;
            await message.util.reply(`you lost all of your betting!`)
        }
        else if (rand == 1) {
            num = coin - amount;
            coin = num;
            await message.util.reply(`you lost all of your betting!`)
        }
        else if (rand == 2) {
            num = coin - Math.round(amount);
            coin = num;
            await message.util.reply(`you lost half of your betting!`)
        }
        else if (rand == 3) {
            num = coin - Math.round(amount);
            coin = num;
            await message.util.reply(`you lost half of your betting!`)
        }
        else if (rand == 4) {
            num = (amount * 2);
            coin = coin + num;
            await message.util.reply(`you won ${num}`)
        }
        else if (rand == 5) {
            num = (amount * 3);
            coin = coin + num;
            await message.util.reply(`you won ${num}`)
        }
        
        coins[user.id] = {
            coins: coin,
            bank: bank
        }
        
        fs.writeFile('data/coins.json', JSON.stringify(coins), (err) => {
            if (err) jsonError;
        });
    }
}

module.exports = GambleCommand;