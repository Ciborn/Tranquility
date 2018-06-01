const poolQuery = require('../../functions/databasePoolQuery');
const isEmpty = require('./../../functions/utils/isEmpty');
const config = require('./../../../config.json');
const Cache = require('./../../structures/Cache');
const Perms = require('./../Tranquility/Perms');
module.exports = class User {
    constructor(member) {
        for (let [key, value] of Object.entries(member)) this[key] = value;
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
            const cache = new Cache(this.guild.id, this.user.id);
            if (cache.get('userId') == undefined) {
                const userData = await poolQuery(`SELECT * FROM users WHERE userId='${this.user.id}' AND guildId='${this.guild.id}'`);
                if (isEmpty(userData)) {
                    poolQuery(`INSERT INTO users (userId, guildId, guildPerms, statistics, boosts, inventory, settings) VALUES ('${this.user.id}', '${this.guild.id}', ${this.guild.defaultPerms}, '{}', '{}', '{}', '{}')`).then(() => {
                        this.setProperties(userData[0]);
                    });
                } else {
                    this.setProperties(userData[0]);
                }
            } else {
                const userData = JSON.parse(require('fs').readFileSync(`cache/${this.guild.id}/${this.user.id}`, {encoding: 'utf8'}));
                for (let [key, value] of Object.entries(userData)) this[key] = value;
            }
            this.perms = {
                bot: new Perms(this.botPerms, require('./../../data/perms.json')),
                guild: new Perms(this.guildPerms, require('./../../data/guildPerms.json'))
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
}