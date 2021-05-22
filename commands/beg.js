const { Command } = require('discord-akairo');
const coins = require('../data/coins.json');
const check = require('../data/name.json');
const respect = require('../data/respect.json');
const { random, jsonError } = require('../funcs.js');
const fs = require('fs');

class BegCommand extends Command {
    constructor() {
        super('beg', {
            aliases: ['beg'],
            category: 'economy',
            description: 'Beg for money.',
            cooldown: 43200000,
            channel: 'guild',
        })
    }

    async exec(message) {
        let user = message.author;
        let coin = coins[user.id].coins;
        let bank = coins[user.id].bank;
        let respectXP = respect[user.id].respect;
        if (check[user.id].player == false) {
            return await message.util.send(`${user}, you have not started your journey yet!\nStart your journey with \`~start\``)
        }
        else {
            if (respectXP < 50) {
                return await message.util.reply('I don\'t **respect** people like you');
            }
            let randNum = random(500) + 1;
            coin = coin + randNum;
            coins[user.id] = {
                coins: coin,
                bank: bank
            }
            fs.writeFile('data/coins.json', JSON.stringify(coins), (err) => {
                if (err) jsonError(err);
            })
            return await message.util.reply(`oh silly... Here have ${randNum}!`);
        }
    }
}

module.exports = BegCommand;