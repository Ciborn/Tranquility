const poolQuery = require('./../../functions/database/poolQuery');
const fs = require('fs');
module.exports = class GuildLeaderboard {
    constructor(guildId) {
        this.guildId = guildId;
    }

    async init() {
        return new Promise(async (resolve, reject) => {
            this.lead = {};
            if (fs.existsSync(`cache/${this.guildId}/lead.json`)) {
                this.lead = fs.readFileSync(`cache/${this.guildId}/lead.json`, {encoding: 'utf8'});
            } else {
                const dbQuery = await poolQuery(`SELECT * FROM users WHERE guildId='${this.guildId}'`);
                for (let element of dbQuery) this.lead[element.userId] = element;
                fs.writeFileSync(`cache/${this.guildId}/lead.json`, JSON.stringify(this.lead));
            }
            resolve(this);
        })
    }
}