const { Listener } = require('discord-akairo');
const moment = require('moment');
const Discord = require('discord.js');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        let client = this.client
        let timestamp = Number(new Date());
        let timeMoment = () => moment(timestamp).format("H:mm");
        console.log(`${timeMoment()} | ${client.user.tag} signed into ${client.guilds.cache.size} servers, and helping ${client.users.cache.size} users.`)
    }
};

module.exports = ReadyListener;