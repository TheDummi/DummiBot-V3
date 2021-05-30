const { Listener } = require('discord-akairo');
const moment = require('moment');
const Discord = require('discord.js');
const botSettings = require('../data/botSettings.json');
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
        console.log(`${timeMoment()} | ${client.user.username} signed into ${client.guilds.cache.size} servers, and helping ${client.users.cache.size} users.`)
        let richPresence = botSettings.richPresence;
        let randRichPresence = () => richPresence[Math.floor(Math.random() * richPresence.length)];
        client.user.setPresence({ activity: { type: "WATCHING", name: randRichPresence() }})
        setInterval(async () => {
            client.user.setPresence({ activity: { type: "WATCHING", name: randRichPresence() }})
        }, 60000)
    }
};

module.exports = ReadyListener;