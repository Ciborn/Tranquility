const poolQuery = require('../../functions/databasePoolQuery');
const isEmpty = require('./../../functions/utils/isEmpty');
const config = require('./../../../config.json');
const Cache = require('./../../structures/Cache');
const Perms = require('./../Tranquility/Perms');
const fs = require('fs');
module.exports = class User {
    constructor(member) {
        for (let [key, value] of Object.entries(member)) this[key] = value;
    }

    async init() {
        return new Promise((resolve, reject) => {
            this.updateUserCache().then(() => {
                this.perms = {
                    bot: new Perms(this.botPerms, require('./../../data/perms.json')),
                    guild: new Perms(this.guildPerms, require('./../../data/guildPerms.json'))
                }
                resolve(this);
            }).catch(err => {
                reject(err);
            });
        })
    }

    async updateUserCache() {
        return new Promise(async (resolve, reject) => {
            const cache = new Cache(this.guild.id, this.user.id);
            if (cache.get('userId') == undefined) {
                const userData = await poolQuery(`SELECT * FROM users WHERE userId='${this.user.id}' AND guildId='${this.guild.id}'`);
                if (isEmpty(userData)) {
                    const statisticsModel = JSON.stringify({
                        total: 0,
                        types: {
                            chat: {},
                            bots: {},
                            spam: {},
                            others: 0
                        },
                        channels: {},
                        times: {}
                    });
                    poolQuery(`INSERT INTO users (userId, guildId, guildPerms, statistics, boosts, inventory, lastMessage, settings) VALUES ('${this.user.id}', '${this.guild.id}', ${this.guild.defaultPerms}, '${statisticsModel}', '{}', '{}', '{}', '{}')`).then(() => {
                        this.setProperties(userData[0]);
                    });
                } else {
                    this.setProperties(userData[0]);
                }
            } else {
                const userData = JSON.parse(fs.readFileSync(`cache/${this.guild.id}/${this.user.id}`, {encoding: 'utf8'}));
                for (let [key, value] of Object.entries(userData)) this[key] = value;
            }
            resolve(this);
        })
    }

    setProperties(data) {
        const cache = new Cache(this.guild.id, this.user.id);
        for (let [property, value] of Object.entries(data)) {
            this[property] = value;
            cache.set(property, value);
        }
    }

    async updateStatistics(message) {
        const statistics_wordsForOthers = fs.readFileSync('core/data/statistics/wordForOthers.json', {encoding: 'utf8'});
        const collected = await message.channel.awaitMessages(msg => msg.author.bot, {time: 1000, max: 1});

        for (let element in statistics_wordsForOthers) {
            if (message.content.indexOf(element) != -1) {
                this.statistics.types.others++;
            }
        }

        if (collected.size > 0) {
            if (this.)
            this.statistics.types.bots[collected.first().id] == undefined ? this.statistics.types.bots[collected.first().id] = 1 : this.statistics.types.bots[collected.first().id]++;
        } else {
            this.statistics.types.chat == undefined ? this.statistics.types.chat = 1 : this.statistics.types.chat++
        }

        if (collected.size > 0)  
        if (collected.size == 0) 

        poolQuery(`UPDATE users SET statistics='${JSON.stringify(this.statistics)}' WHERE userId='${this.user.id}' AND guildId='${this.guild.id}'`).then(() => {
            const cache = new Cache(this.guild.id, this.user.id);
            cache.set('statistics', this.statistics);
        })
    }
}