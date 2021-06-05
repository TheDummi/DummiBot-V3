const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const fs = require('fs');

const { dataCheck } = require('../funcs.js');

const name = require('../data/name.json');
const xp = require('../data/xp.json');
const respect = require('../data/respect.json');
const coins = require('../data/coins.json');
const profile = require('../data/profile.json');
const storage = require('../data/storage.json');
const botSettings = require('../data/botSettings.json');

class StartCommand extends Command {
    constructor() {
        super('start', {
            aliases: ['start', 'join'],
            category: 'start',
            description: 'Start your journey as a game character but on discord!',
            args: [
                {
                    id: 'starter',
                    type: ['hunter', 'sniper', 'tank', 'warrior', 'warlock'],
                    prompt: {
                        start: message => `${message.author} what class would you like to be?\n\`hunter\`\n\`sniper\`\n\`tank\`\n\`warrior\`\n\`warlock\``,
                        retry: message => `${message.author} answer with\n\`hunter\`\n\`sniper\`\n\`tank\`\n\`warrior\`\n\`warlock\`.`,
                        cancel: message => `${message.author} You did not start your journey!`,
                        ended: message => `${message.author} retry \`~start\` command.`,
                        timeout: message => `${message.author} retry \`~start\` command.`
                    }
                }
            ]
        })
    }

    async exec(message, args) {
        let user = message.author;
        let playerClass = args.starter;
        let player = name[user.id].player;
        let levelDm = name[user.id].levelDm;
        if (!name[user.id]) {
            name[user.id] = {
                player: false,
                levelDm: true
            }
            
            fs.writeFile('data/name.json', JSON.stringify(name), (err) => {
                if (err) console.log(err)
            })
        }
        if (player == false) {
            dataCheck(message)

            let Class = profile[user.id].class;
            let skillPoints = profile[user.id].skillPoints;
            let maxHealth = profile[user.id].maxHealth;
            let health = profile[user.id].health;
            let attack = profile[user.id].attack;
            let defense = profile[user.id].defense;
            let stamina = profile[user.id].stamina;
            let maxStamina = profile[user.id].maxStamina;
            let dodge = profile[user.id].dodge;
            let stealth = profile[user.id].stealth;
            let critical = profile[user.id].critical;
            let Storage = profile[user.id].storage;
            let maxStorage = profile[user.id].maxStorage;
    
            if (playerClass == 'hunter') {
                Class = 'hunter';
                skillPoints = 1;
                maxHealth = 70;
                health = 70;
                attack = 15;
                defense = 15;
                stamina = 500;
                maxStamina = 500;
                dodge = 10;
                stealth = 25;
                critical = 2;
                Storage = 0;
                maxStorage = 300;
            }
            if (playerClass == 'sniper') {
                Class = 'sniper';
                skillPoints = 1;
                maxHealth = 90;
                health = 90;
                attack = 10;
                defense = 10;
                stamina = 150;
                maxStamina = 150;
                dodge = 5;
                stealth = 20;
                critical = 10;
                Storage = 0;
                maxStorage = 500;
            }
            if (playerClass == 'tank') {
                Class = 'tank';
                skillPoints = 1;
                maxHealth = 200;
                health = 200;
                attack = 25;
                defense = 100;
                stamina = 50;
                maxStamina = 50;
                dodge = 1;
                stealth = 1;
                critical = 10;
                Storage = 0;
                maxStorage = 1000;
            }
            if (playerClass == 'warrior') {
                Class = 'warrior';
                skillPoints = 1;
                maxHealth = 150;
                health = 150;
                attack = 20;
                defense = 50;
                stamina = 300;
                maxStamina = 300;
                dodge = 15;
                stealth = 5;
                critical = 10;
                Storage = 0;
                maxStorage = 300;
            }
            if (playerClass == 'warlock') {
                Class = 'warlock';
                skillPoints = 1;
                maxHealth = 100;
                health = 100;
                attack = 10;
                defense = 10;
                stamina = 1000;
                maxStamina = 1000;
                dodge = 5;
                stealth = 20;
                critical = 10;
                Storage = 0;
                maxStorage = 500;
            }
            profile[user.id] = {
                class: Class,
                skillPoints: skillPoints,
                maxHealth: maxHealth,
                health: health,
                attack: attack,
                defense: defense,
                stamina: stamina,
                maxStamina: maxStamina,
                dodge: dodge,
                stealth: stealth,
                critical: critical,
                storage: Storage,
                maxStorage: maxStorage,
            }
            player = true;
            name[user.id] = {
                player: player,
                levelDm: levelDm
            }
            fs.writeFile('data/name.json', JSON.stringify(name), (err) => {
                if (err) console.log(err)
            })
            fs.writeFile('data/xp.json', JSON.stringify(xp), (err) => {
                if (err) console.log(err)
            });
            fs.writeFile('data/respect.json', JSON.stringify(respect), (err) => {
                if (err) console.log(err)
            });
            fs.writeFile('data/coins.json', JSON.stringify(coins), (err) => {
                if (err) console.log(err)
            });
            fs.writeFile('data/profile.json', JSON.stringify(profile), (err) => {
                if (err) console.log(err)
            });
            fs.writeFile('data/storage.json', JSON.stringify(storage), (err) => {
                if (err) console.log(err)
            });
        }
        else {
            return await message.util.send(`${message.author}, you've already started your journey!`)
        }
    }
};

module.exports = StartCommand;