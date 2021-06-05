const fs = require("fs");
const got = require("got");
const Discord = require('discord.js');
const e = new Set();
const ee = new Set();

const name = require('./data/name.json');
const xp = require('./data/xp.json');
const respect = require('./data/respect.json');
const coins = require('./data/coins.json');
const profile = require('./data/profile.json');
const storage = require('./data/storage.json');
const botSettings = require('./data/botSettings.json');
let color = botSettings.color;

const hasteURLs = [
    "https://hst.sh",
    "https://hastebin.com",
    "https://haste.clicksminuteper.net",
    "https://haste.tyman.tech"
]

function randColor() {
    var letters = '0123456789ABCDEF';
    var color = '';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

module.exports = {
    dataCheck(message) {
        let user = message.author;
        if (!xp[user.id]) {
            xp[user.id] = {
                xp: 0,
                level: 1
            }
        }

        if (!respect[user.id]) {
            respect[user.id] = {
                respect: 100
            }
        }
        
        if (!coins[user.id]) {
            coins[user.id] = {
                coins: 0,
                bank: 0
            }
        }

        if (!profile[user.id]) {
            profile[user.id] = {
                class: undefined,
                skillPoints: 1, // start off with 1
                maxHealth: 100, // max = 8    | 1 sp = +5
                health: 100,    // This is the amount you have.
                attack: 10,     // max = 8    | 1 sp = +5
                defense: 10,    // max = 8    | 1 sp = +5
                stamina: 200,   // This is the amount yo have
                maxStamina: 200,// max = 8    | 1 sp = +10
                dodge: 1,       // max = 50%  | 1 sp = +1%
                stealth: 1,     // max = 100% | 1 sp = +1%
                critical: 2,    // max = 300% | 1 sp = +2%
                storage: 0,     // This is the amount you have.
                maxStorage: 400 // max = 8    | 5 sp = +50
                                // 8 = infinite, sp = skillPoint(s)
            }
        }
        
        if (!storage[user.id]) {
            storage[user.id] = {
                deer: 0,
                rabbit: 0,
                wolf: 0,
                ox: 0,
                raccoon: 0,
                bison: 0,
                crocodile: 0,
                skunk: 0,
                fish: 0,
                medkit: 0,
                bandage: 0,
                syringe: 0,
                doubleXp: 0,
                doubleCoins: 0,
                serverBooster: 0,
            }
        }
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
    },
    jsonError(err) {
        let errEmbed = new Discord.MessageEmbed()
            .setTitle('JSON ERROR')
            .setColor(0xaa00cc)
            .setDescription(`\`\`\`json\n${err}\`\`\``)
        return errEmbed;
    },
    doubleXpSetter(message) {
        return e.has(message.author.id);
    },
    doubleXpSet(message) {
        
        if (e.has(message.author.id)) {
            return message.util.reply('You\'ve already used a booster!')
        }
        else {
            e.add(message.author.id)
            setTimeout(() => {
                message.author.send('Your booster ran out!')
                e.delete(message.author.id)
            }, 1800000)
        }
    },
    doubleCoinsSetter(message) {
        return ee.has(message.author.id);
    },
    doubleCoinsSet(message) {
        
        if (ee.has(message.author.id)) {
            return message.util.reply('You\'ve already used a booster!')
        }
        else {
            ee.add(message.author.id)
            setTimeout(() => {
                message.author.send('Your booster ran out!')
                ee.delete(message.author.id)
            }, 1800000)
        }
    },
    set(message) {
        const set = new Set()
        let user = message.author.id;
        if (set.has(user)) return;
        else {
            set.add(user)
            setTimeout(async () => {
                await set.delete(user)
            })
        }
        return set;
    },
    random(args) {
        let random = Math.floor(Math.random() * Math.floor(args));
        return random
    },
    randomEmojis() {
        let choices = new Discord.Collection()
        let choicesLeft = message.guild.emojis.cache.filter(e => e.animated)
        let curChoice = "";
        for (let i = 0; i < Number(args[0]); i++) {
            curChoice = choicesLeft.randomKey()
            choices.set(curChoice, choicesLeft.get(curChoice))
            choicesLeft.delete(curChoice)
        }
        return choices
    },
    getUptime(client) {
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
        let noSecUptime = `${days} days, ${hours} hours and ${minutes} minutes`;
        return {uptime: uptime, noSecUptime: noSecUptime};
    },
    /*getPrefix(message) {
        let p = "~"
        var data = fs.readFileSync("data/serverData.json");
        const json = JSON.parse(data);
        if (json.prefixes[String(message.guild.id)]) {
            p = json.prefixes[String(message.guild.id)]
        }
        return p
    },*/
    async haste(text) {
        for (const url of hasteURLs) {
            try {
                const resp = await got.post(url + "/documents", {
                    body: text
                }).json()
                return `${url}/${resp.key}`
            } catch {
                continue
            }
        }
        throw new Error("Haste failure")
    },
    capitalize(name) {
        name = name.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1)
    },
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    },
    getReactions(message) {
        var data = fs.readFileSync("data.json").toString();
        const json = JSON.parse(data); 
        if (json.reactions.includes(message.guild.id)) {
            return true
        }
        return false
    },
    //const {randColor} = require("../funcs.js")
    randColor: randColor,
    // const {paginate} = require("../funcs.js")
    async paginate(message, embeds) {
        embeds.forEach((e, i) => {
            embeds[i] = embeds[i].setFooter(`Page ${i+1}/${embeds.length} | Click ❔ for help!`)
        })
        let curPage = 0;
        if ((typeof embeds) !== "object") return
        const m = await message.channel.send(embeds[curPage])
        m.react("⏪")
        m.react("◀")
        m.react("⏹")
        m.react("▶")
        m.react("⏩")
        m.react("🔢")
        m.react("❔")
        const filter = (r, u) => ["⏪", "◀", "⏹", "▶", "⏩", "🔢", "❔"].includes(r.emoji.toString())
        coll = m.createReactionCollector(filter)
        let timeout = setTimeout(async () => {
            await m.edit("Timed out.", {embed: null})
            try {
                await m.reactions.removeAll()
            }
            catch {}
            coll.stop()
        }, 300000)
        coll.on("collect", async (r, u) => {
            if (u.id == message.client.user.id) return
            const userReactions = m.reactions.cache.filter(reaction => reaction.users.cache.has(u.id));
            for (const reaction of userReactions.values()) {
                try {
                    await reaction.users.remove(u.id);
                }
                catch {}
            }
            if (u.id != message.author.id) return
            clearTimeout(timeout)
            timeout = setTimeout(async () => {
                await m.edit("Timed out.", {embed: null})
                try {
                    await m.reactions.removeAll()
                }
                catch {}
                coll.stop()
            }, 300000)
            if (r.emoji.toString() == "◀") {
                if (curPage - 1 < 0) return
                if (!embeds[curPage - 1]) return
                curPage--
                await m.edit(embeds[curPage])
            }
            else if (r.emoji.toString() == "▶") {
                if (!embeds[curPage + 1]) return
                curPage++
                m.edit(embeds[curPage])
            }
            else if (r.emoji.toString() == "⏹") {
                clearTimeout(timeout)
                await m.edit("Command closed by user.", {embed: null})
                try {
                    await m.reactions.removeAll()
                }
                catch {}
                coll.stop()
            }
            else if (r.emoji.toString() == "⏪") {
                curPage = 0
                await m.edit(embeds[curPage])
            }
            else if (r.emoji.toString() == "⏩") {
                curPage = embeds.length - 1
                await m.edit(embeds[curPage])
            }
            else if (r.emoji.toString() == "🔢") {
                const filter = m => m.author.id == message.author.id && !(isNaN(Number(m.content)))
                const m1 = await message.reply("What page would you like to see? (Must be a number)")
                message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time']})
                .then(async messages => {
                    let resp = messages.array()[0]
                    resp = Number(resp.content)
                    const embedChange = embeds[resp - 1] || null
                    if (embedChange === null) {
                        const mErr = await message.channel.send("Invalid page.")
                        try {
                            await messages.array()[0].delete()
                        }
                        catch {}
                        setTimeout(async () => {
                            await mErr.delete()
                            await m1.delete()
                        }, 10000);
                        return
                    };
                    curPage = resp - 1
                    await m.edit(embedChange)
                    try {
                        await messages.array()[0].delete()
                    }
                    catch {}
                    await m1.delete()
                })
                .catch(async messages => {
                    const mErr = await message.channel.send(`Took too long.`)
                    setTimeout(async () => {
                        await mErr.delete()
                        await m1.delete()
                    }, 10000);
                });
            }
            else if (r.emoji.toString() == "❔") {
                let embed4 = new Discord.MessageEmbed()
                .setTitle('Legend')
                .setDescription('⏪: first page\n\n◀: previous page\n\n⏹: close command\n\n▶: next page\n\n⏩: last page\n\n🔢: page picker\n\n❔: toggle help menu')
                    .setColor(color)
                const e = m.embeds[0]
                const isSame = e.title === embed4.title && e.footer === embed4.footer && e.description === embed4.description
                if (isSame) {
                    await m.edit(embeds[curPage])
                }
                else {
                    await m.edit(embed4)
                }
            }
        })
    },
};