const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const fs = require('fs');

const name = require('../data/name.json');

class StartCommand extends Command {
    constructor() {
        super('start', {
            aliases: ['start', 'join'],
            category: 'start',
            description: 'Start your journey as a game character but on discord!',
            args: [
                {
                    id: 'starter',
                    type: ['yes', 'no'],
                    prompt: {
                        start: message => `${message.author} would you like to create a profile?`,
                        retry: message => `${message.author} answer with \`yes\` or \`no\`.`,
                        cancel: message => `${message.author} I did not create a profile.`,
                        ended: message => `${message.author} retry \`~start\` command.`,
                        timeout: message => `${message.author} retry \`~start\` command.`
                    }
                }
            ]
        })
    }

    async exec(message, args) {
        let user = message.author
        let player = name[user.id].player;
        let levelDm = name[user.id].levelDm
        if (player != false) {
            return await message.util.send(`${user}, you're already in!`)
        }
        else {
                if (args.starter == 'yes') {
                    
                name[user.id] = {
                    player: true,
                    levelDm: levelDm
                }

                fs.writeFile('data/name.json', JSON.stringify(name), (err) => {
                    if (err) console.log(err)
                });
                return await message.util.send(`${user} Oh? did you just get a free skill point? check it out with \`~profile\``)
            }
            else if (args.starter == 'no') {
                return await message.util.send(`${user}, such a shame, I was looking forward to our time together...`)
            }
        }
    }
};

module.exports = StartCommand;