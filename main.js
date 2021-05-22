const fs = require('fs');
const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, setEmitters } = require('discord-akairo');
const botSettings = require('./data/botSettings.json');
class MyClient extends AkairoClient {
    constructor() {
        super({
            ownerID: ['482513687417061376'],
        },
        {
            disableMentions: 'everyone'
        });
        this.commandHandler = new CommandHandler(this, {
            directory: './commands/',
            prefix: botSettings.prefixes,
            defaultCooldown: 1000,
            handleEdits: true,
            commandUtil: true,
            clientPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES"]
        });        
        this.commandHandler.loadAll();
        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './inhibitors/'
        });
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.inhibitorHandler.loadAll();
        this.listenerHandler = new ListenerHandler(this, {
            directory: './listeners/'
        });
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler,
            process: process,
        });
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
    }
}
const client = new MyClient();
const token = fs.readFileSync("token.txt").toString()
client.login(token);