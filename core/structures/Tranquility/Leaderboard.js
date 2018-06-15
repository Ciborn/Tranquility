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
                this.lead = JSON.parse(fs.readFileSync(`cache/${this.guildId}/lead.json`, {encoding: 'utf8'}));
            } else {
                const dbQuery = await poolQuery(`SELECT * FROM users WHERE guildId='${this.guildId}'`);
                for (let element of dbQuery) {
                    this.lead[element.userId] = element;
                    delete this.lead[element.userId].guildId;
                    delete this.lead[element.userId].botPerms;
                    delete this.lead[element.userId].lastMessage;
                    delete this.lead[element.userId].boosts;
                    delete this.lead[element.userId].inventory;
                    delete this.lead[element.userId].settings;
                    delete this.lead[element.userId].userId;
                }

                var actualLead = {};
                for (let [userId, data] of Object.entries(this.lead)) {
                    for (let [property, value] of Object.entries(data)) {
                        if (actualLead[property] == undefined) actualLead[property] = {};
                        actualLead[property][userId] = {
                            rank: 0,
                            value: value
                        }
                    }
                }
        
                this.lead = {};
                for (let [property, users] of Object.entries(actualLead)) {
                    let usersMap = new Map();
                    for (let [userId, data] of Object.entries(users)) usersMap.set(userId, data.value);
                    usersMap[Symbol.iterator] = function* () { yield* [...this.entries()].sort((a, b) => b[1] - a[1]) };
        
                    var index = 1;
                    for (let [userId, value] of usersMap) {
                        actualLead[property][userId].rank = index;
                        
                        if (this.lead[property] == undefined) this.lead[property] = {};
                        if (this.lead[property][userId] == undefined) this.lead[property][userId] = {};
                        this.lead[property][userId] = {
                            rank: index,
                            value: value
                        }
        
                        index++;
                    }
                }
                fs.writeFileSync(`cache/${this.guildId}/lead.json`, JSON.stringify(this.lead));
            }

            for (let [key, value] of Object.entries(this.lead)) {
                this[key] = value;
            }

            resolve(this);
        })
    }
}
