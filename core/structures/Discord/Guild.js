const poolQuery = require('../../functions/database/poolQuery');
const Leaderboard = require('./../Tranquility/Leaderboard');
const config = require('./../../../config.json');
const User = require('./User');
module.exports = class Guild {
    constructor(guild) {
        for (let [key, value] of Object.entries(guild)) this[key] = value;
        this.id = guild.id;
    }

    async init() {
        const guildData = await poolQuery(`SELECT * FROM guildssettings WHERE guildId='${this.id}'`);
        if (!guildData.length) {
            poolQuery(`INSERT INTO guildssettings (guildId, prefix, defaultPerms, settings) VALUES ('${this.id}', '${config.bot.defaultPrefix}', '${config.bot.defaultGuildPerms}', '{}')`).then(async () => {
                await this.init();
            });
        } else {
            for (let [key, value] of Object.entries(guildData[0])) this[key] = value;
            this.leaderboard = await new Leaderboard(this.id).init();
            return this;
        }
    }

    async fetchMember(userId) {
        if (this.members[userId] == undefined) this.members[userId] = new User(this.members.get(userId));
        await this.members[userId].init();
        return this.members[userId];
    }
}