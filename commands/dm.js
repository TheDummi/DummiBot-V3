const { Command } = require('discord-akairo');
const check = require('../data/name.json');
const fs = require('fs');

async function DmCheck(message) {
    if (check[message.author.id].levelDm == true) return "Dm on level up on."
    if (check[message.author.id].levelDm == false) return "Dm on level up off."
}

class DMCommand extends Command {
    constructor() {
        super('DM', {
            aliases: ['DM'],
            category: 'settings',
            description: 'Toggle level up messages in DM on or off.',
            channel: 'dm',
            args: [
                {
                    id: 'yesOrNo',
                    type: ['yes', 'no', 'on', 'off'],
                    prompt: {
                        start: message => `${message.author} do you want to disable level up messages on DM?`,
                        retry: message => `${message.author}, not a valid option, answer with \`yes\` or \`no\`.`,
                        cancel: message => `${message.author} you kept your old settings. ${DmCheck(message)}`,
                        ended: message => `${message.author} I couldn't get that. Retry \`~dm\``,
                        timeout: message => `${message.author} retry \`~dm\``,
                    }
                }
            ]
        });
    }

    async exec(message, args) {
        let user = message.author;
        let choice = args.yesOrNo;

        let player = check[user.id].player;
        let levelDm = check[user.id].levelDm;

        if (choice == 'yes' || choice == 'off') {
            choice = "off"
            levelDm = false;
        }
        if (choice == 'no' || choice == 'on') {
            choice = "on"
            levelDm = true;
        }
        check[user.id] = {
            player: player,
            levelDm: levelDm
        }
        fs.writeFile('data/name.json', JSON.stringify(check), (err) => {
            if (err) console.log(err);
        })
        return await message.util.send(`${user}, you turned \`DM on level up\` ${choice}.`)
    }
};

module.exports = DMCommand