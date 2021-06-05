const { Command } = require('discord-akairo');
const check = require('../data/name.json');

class SuCommand extends Command {
    constructor() {
        super('su', {
            aliases: ['su', 'pretend'],
            category: 'owner',
            description: 'Become someone else',
            ownerOnly: true,
            args: [
                {
                    id: 'user',
                    type: 'user'
                },
                {
                    id: 'command',
                    type: 'command',
                }
            ]
        })
    }

    async exec(message, args) {
        let user = this.client.users.cache.get(args.user.id) || null;
        let commandExecute = args.command;
        let command;
        try {
            command = this.handler.modules.get(commandExecute.id)
        }
        catch (e) {
            return message.util.send(`Could not find ${args.command}!`)
        }
        if (user === null) return await message.util.send('Invalid user')
        message.author = user;
        command.exec(message)
    }
}

module.exports = SuCommand;