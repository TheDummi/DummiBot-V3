const { Command, Argument } = require('discord-akairo');
const fs = require('fs');

const coins = require('../data/coins.json');
const xp = require('../data/xp.json');
const check = require('../data/name.json');

class WithdrawCommand extends Command {
    constructor() {
        super('withdraw', {
            aliases: ['withdraw', 'wit'],
            category: 'economy',
            description: 'Withdraw money from your bank.',
            channel: 'guild',
            args: [
                {
                    id: 'amount',
                    type: Argument.union('all', 'number'),
                    prompt: {
                        start: message => `${message.author} how much would you like to withdraw? You have ₪ ${coins[message.author.id].bank} in your bank.`,
                        retry: message => `${message.author} answer with \`all\` or an amount. You have ₪ ${coins[message.author.id].bank} in your bank.`,
                        cancel: message => `${message.author} you did not withdraw anything.`,
                        ended: message => `${message.author} I couldn\'t read that amount. Retry \`~withdraw\`.`,
                        timeout: message => `${message.author} I moved on to helping someone else...`
                    }
                }
            ]
        })
    }

    async exec(message, args) {
        let user = message.author;

        let num = args.amount;

        let all;
        if (check[user.id].player == false) {
            return await message.util.send(`${user}, you have not started your journey yet!\nStart it with \`~start\``)
        }
        let coin = coins[user.id].coins;
        let bank = coins[user.id].bank;
        let level = xp[user.id].level;
        let maxBank = level * 1000;
        if (num == 'all') {
                all = bank;
            }
        else if (isNaN(num)) {
                    return await message.util.send(`${user}, \`${num}\`, is not a valid amount.`)
            }
        else {
            if (num > bank || num > maxBank) {
                return await message.util.send(`${user}, you don't have that amount in your bank!`);
            }
            else if (num < 0) {
                return await message.util.send(`${user}, you can't withdraw negative amounts!`)
            }
            else {
                all = num;
            }
        }
        coins[user.id] = {
            coins: coin + Number(all),
            bank: bank - Number(all)
        }
        fs.writeFile('data/coins.json', JSON.stringify(coins), (err) => {
            if (err) console.log(err)
        });
        return await message.util.send(`${user}, you have withdrawn ₪ ${all}, you now have ${coin + Number(all)}, in your wallet.`)
    }
};

module.exports = WithdrawCommand;