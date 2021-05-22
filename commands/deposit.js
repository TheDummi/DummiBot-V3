const { Command, Argument } = require('discord-akairo');
const fs = require('fs');

const check = require('../data/name.json');
const xp = require('../data/xp.json');
const coins = require('../data/coins.json');
const botSettings = require('../data/botSettings.json');

class DepositCommand extends Command {
    constructor() {
        super('deposit', {
            aliases: ['deposit', 'dep'],
            category: 'economy',
            description: 'Deposit money to you bank so its safe...',
            channel: 'guild',
            args: [
                {
                    id: 'amount',
                    type: Argument.union('all', 'number'),
                    prompt: {
                        start: message => `${message.author} how much would you like to deposit? You have ₪ ${coins[message.author.id].coins} in your wallet.`,
                        retry: message => `${message.author} answer with \`all\` or an amount. You have ₪ ${coins[message.author.id].coins} in your wallet.`,
                        cancel: message => `${message.author} you did not deposit anything.`,
                        ended: message => `${message.author} I couldn\'t read that amount. Retry \`~deposit\`.`,
                        timeout: message => `${message.author} I moved on to helping someone else...`
                    }
                }
            ]
        })
    }

    async exec(message, args) {
        let num = args.amount;
        let user = message.author
        

        if (check[user.id].player == false) {
            return await message.util.send(`${user}, you have not started your journey yet!\nStart it with \`~start\``)
        }
        else {
            let all;
            let coin = coins[user.id].coins;
            let bank = coins[user.id].bank;
            let level = xp[user.id].level;
            let maxBank = level * 1000

            if (num == 'all') {
                
                if (bank >= maxBank) {
                    return await message.channel.send(`${user}, you already have a full bank!`)
                }
                if (num < 0) {
                    return await message.util.send(`${user}, you can't deposit negative amounts!`)
                }
                if (coin < bank) all = coin;
                
                if (bank <= 0) {
                    if (coin <= maxBank) all = coin;
                    if (coin >= maxBank) all = maxBank;
                }
                if (coin > maxBank - bank) all = maxBank - bank;
            }
            else if (isNaN(num)) {
                return await message.util.send(`${user}, \`${num}\`, is not a valid amount.`)
            }
            else {
                if (num > coin) {
                    return await message.util.send(`${user}, you don't have that amount in your wallet.`)
                }
                if (num > maxBank - bank) {
                    return await message.util.send(`${user}, you don't have enough space in your bank.`)
                }
                if (num < 0) {
                    return await message.util.send(`${user}, you can't deposit negative amounts!`)
                }
                all = num;
            }
            coins[user.id] = {
                coins: coin - Number(all),
                bank: bank + Number(all)
            }
            fs.writeFile('data/coins.json', JSON.stringify(coins), (err) => {
                if (err) console.log(err)
            });
            return await message.util.send(`${user}, you deposited ₪ ${all}, you now have ₪ ${coin - Number(all)} in your wallet.`)
        }
    }
};

module.exports = DepositCommand;
