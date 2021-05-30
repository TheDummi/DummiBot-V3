const { Command, Argument } = require('discord-akairo');
const fs = require('fs');
const profile = require('../data/profile.json');
const check = require('../data/name.json');


class UpgradeCommand extends Command {
    constructor() {
        super('upgrade', {
            aliases: ['upgrade', 'up'],
            category: 'stats',
            description: 'Upgrade your skills from `~profile`',
            channel: 'guild',
            args: [
                {
                    id: 'choice',
                    type: ['health', 'hp', 'attack', 'atk', 'defense', 'def', 'stamina', 'energy', 'dodge', 'dod', 'stealth', 'sneak', 'critical', 'crit', 'storage', 'space'],
                    prompt: {
                        start: message => `${message.author} what would you like to upgrade?\n\`health\`\n\`attack\`\n\`defense\`\n\`stamina\`\n\`dodge\`\n\`stealth\`\n\`critical\`\n\`storage\``,
                        retry: message => `${message.author}, not a valid skill. What would you like to upgrade?\n\`health\`\n\`attack\`\n\`defense\`\n\`stamina\`\n\`dodge\`\n\`stealth\`\n\`critical\`\n\`storage\``,
                        cancel: message => `${message.author} you didn't upgrade anything`,
                        ended: message => `${message.author} I couldn't upgrade any skills. Retry \`~upgrade\``,
                        timeout: message => `${message.author} I moved on to someone else...`
                    }
                },
                {
                    id: 'amount',
                    type: Argument.union('all', 'number'),
                    prompt: {
                        start: message => `${message.author} how many skillpoints would you like to spend? You have ${profile[message.author.id].skillPoints}.`,
                        cancel: message => `${message.author} you didn't upgrade anything`,
                        ended: message => `${message.author} I couldn't upgrade any skills. Retry \`~upgrade\``,
                        timeout: message => `${message.author} I moved on to someone else...`
                    }
                }
            ]
        })
    }

    async exec(message, args) {
        let user = message.author;
        let choice = args.choice;
        let amount = args.amount;
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
        let storage = profile[user.id].storage;
        let maxStorage = profile[user.id].maxStorage;
        let num;
        let num2;
        if (amount == 'all') {
            num = skillPoints
        }
        else if (isNaN(amount)) {
            return await message.util.send(`${user}, \`${amount}\`, is not a valid amount.`)
        }
        else if (skillPoints <= 0) {
            return await message.util.send(`${user}, you have no skill points...`);
        }
        else if (amount < 0) {
            return await message.util.send(`${user}, you can't unskill skills!`)
            }
        else if (amount > skillPoints) {
            return await message.util.send(`${user}, you don't have that many skill points!`)
            }
        else {
            num = amount;
        }
        if (check[user.id].player == false) {
            return await message.util.send(`${user}, you have not started your journey yet!\nStart your journey with \`~start\``)
        }
        else {
            
            num = Number(num);
            if (choice == 'health' || choice == 'hp') {
                choice = 'health'
                num2 = num * 5;
                health = health + num2;
                maxHealth = maxHealth+ num2;
                skillPoints = skillPoints - num;
                
            }
            if (choice == 'attack' || choice == 'atk') {
                choice = 'attack'
                num2 = num * 5;
                attack = attack + num2;
                skillPoints = skillPoints - num
            }
            if (choice == 'defense' || choice == 'def') {
                choice = 'defense'
                num2 = num * 5;
                defense = defense + num2;
                skillPoints = skillPoints - num;
            }
            if (choice == 'stamina' || choice == 'energy') {
                choice = 'stamina'
                num2 = num * 10;
                stamina = stamina + num2;
                maxStamina = maxStamina + num2;
                skillPoints = skillPoints - num;
            }
            let num3;
            if (choice == 'dodge' || choice == 'dod') {
                if (dodge >= 50) {
                    return await message.util.send(`${user}, you're already at the max for dodge!`)
                }
                if (amount == 'all') {
                    num = 0;
                    if (skillPoints > 50 - dodge) {
                        num3 = 50 - dodge
                        num = num3
                    }
                    else {
                        num = skillPoints; 
                    }
                }
                else if (num + dodge > 50) {
                    return await message.util.send(`${user}, you can't go higher than 50%!`);
                }
                
                choice = 'dodge'
                num2 = num;
                
                dodge = dodge + num2;
                skillPoints = skillPoints - num;
            }
            if (choice == 'stealth' || choice == 'sneak') {
                if (stealth >= 100) {
                    return await message.util.send(`${user}, you're already at the max for stealth!`)
                }
                if (amount == 'all') {
                    num = 0;
                    if (skillPoints > 100 - stealth) {
                        num3 = 100 - stealth
                        num = num3
                    }
                    else {
                        num = skillPoints;
                    }
                }
                else if (num + stealth > 100) {
                    return await message.util.send(`${user}, you can't go higher than 100%!`);
                }

                choice = 'stealth'
                num2 = num;
                
                stealth = stealth + num2;
                skillPoints = skillPoints - num;
            }
            if (choice == 'critical' || choice == 'crit') {
                if (critical >= 300) {
                    return await message.util.send(`${user}, you're already at the max for critical!`)
                }
                else if (amount == 'all') {
                    num = 0;
                    if (skillPoints > 152 - critical) {
                        num3 = 152 - critical
                        num = num3
                    }
                    else {
                        num = skillPoints;
                    }
                }
                else if (num + critical > 300) {
                    return await message.util.send(`${user}, you can't go higher than 300%!`);
                }
                
                choice = 'critical'
                num2 = num * 2;
                
                critical = critical + num2;
                skillPoints = skillPoints - num;
            }
            if (choice == 'storage' || choice == 'space') {
                choice = 'storage'
                num2 = num * 50;

                maxStorage = maxStorage * num2;
                skillPoints = skillPoints - num;
            }
            profile[user.id] = {
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
                storage: storage,
                maxStorage: maxStorage,
            }
            fs.writeFile('data/profile.json', JSON.stringify(profile), (err) => {
                if (err) console.log(err)
            });
            return await message.util.send(`${user}, you have upgraded ${choice} by ${num2}.`)
        }
    }
};

module.exports = UpgradeCommand;
