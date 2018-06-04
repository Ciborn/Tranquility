const poolQuery = require('../../functions/database/poolQuery');
const isEmpty = require('./../../functions/utils/isEmpty');
const config = require('./../../../config.json');
const Cache = require('./../../structures/Cache');
const fs = require('fs');
module.exports = class Guild {
    constructor(guild) {
        for (let [key, value] of Object.entries(guild)) this[key] = value;
    }

    async init() {
        return new Promise((resolve, reject) => {
            this.updateUserCache().then(() => {
                resolve(this);
            }).catch(err => {
                reject(err);
            });
        })
    }

    async updateUserCache() {
        return new Promise(async (resolve, reject) => {
            const cache = new Cache(this.id, 'data');
            if (cache.get('guildId') == undefined) {
                const guildData = await poolQuery(`SELECT * FROM guildssettings WHERE guildId='${this.id}'`);
                if (isEmpty(guildData)) {
                    poolQuery(`INSERT INTO guildssettings (guildId, prefix, defaultPerms, settings) VALUES ('${this.id}', '${config.bot.defaultPrefix}', '${config.bot.defaultGuildPerms}', '{}')`).then(() => {
                        this.setProperties(guildData[0]);
                    });
                } else {
                    this.setProperties(guildData[0]);
                }
            } else {
                const guildData = JSON.parse(require('fs').readFileSync(`cache/${this.id}/data`, {encoding: 'utf8'}));
                for (let [key, value] of Object.entries(guildData)) this[key] = value;
            }
            resolve();
        });
    }

    setProperties(data) {
        const cache = new Cache(this.id, 'data');
        for (let [property, value] of Object.entries(data)) {
            this[property] = value;
            cache.set(property, value);
        }
    }
}