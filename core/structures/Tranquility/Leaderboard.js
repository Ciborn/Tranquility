const poolQuery = require('./../../functions/database/poolQuery');
const fs = require('fs');
module.exports = class GuildLeaderboard {
    constructor(guildId) {
        this.guildId = guildId;
    }

    async init() {
        const dbQuery = await poolQuery(`SELECT * FROM users WHERE guildId='${this.guildId}'`);
        this.lead = {};
        for (let element of dbQuery) {
            this.lead[element.userId] = element;
            this.lead[element.userId].statistics = JSON.parse(element.statistics);
            delete this.lead[element.userId].botPerms;
            delete this.lead[element.userId].lastMessage;
            delete this.lead[element.userId].boosts;
            delete this.lead[element.userId].inventory;
            delete this.lead[element.userId].settings;
            delete this.lead[element.userId].userId;
        }

        var actualLead = {};
        console.log(actualLead.statistics);
        console.log(' ');
        console.log(this.lead.statistics);
        const defaultStats = function(value, rank) {
            return {
                rank: rank == undefined ? 0 : rank,
                value: value
            }
        }
        for (let [userId, userData] of Object.entries(this.lead)) {
            for (let [property, value] of Object.entries(userData)) {
                if (property != 'statistics') {
                    if (actualLead[property] == undefined) actualLead[property] = {};
                    actualLead[property][userId] = defaultStats(value);
                } else {
                    actualLead.statistics = {
                        types: {
                            chat: { },
                            bots: { }
                        },
                        bots: {}
                    }
                    for (let [botId, _value] of Object.entries(value.bots)) {
                        if (actualLead.statistics.bots[botId] == undefined) actualLead.statistics.bots[botId] = {};
                        actualLead.statistics.bots[botId][userId] = defaultStats(_value);
                    }
                    for (let [typeName, channels] of Object.entries(value.types)) {
                        if (typeName != 'others') {
                            for (let [channelId, value] of Object.entries(channels)) {
                                if (channelId != 'total') {
                                    if (actualLead.statistics.types[typeName][channelId] == undefined) actualLead.statistics.types[typeName][channelId] = {};
                                    actualLead.statistics.types[typeName][channelId][userId] = defaultStats(value);
                                }
                            }
                        }
                    }
                }
            }
        }

        const sort = function(data) {
            let map = new Map();
            for (let [userId, value] of Object.entries(data)) map.set(userId, value.value);
            map[Symbol.iterator] = function* () { yield* [...this.entries()].sort((a, b) => b[1] - a[1]) };
            return map;
        }

        this.lead = {};
        for (let [property, data] of Object.entries(actualLead)) {
            if (this.lead[property] == undefined) this.lead[property] = {};
            if (property != 'statistics') {
                var index = 1;
                for (let [userId, value] of sort(data)) {
                    this.lead[property][userId] = defaultStats(value, index);
                    index++;
                }
            } else {
                for (let [botId, value] of Object.entries(data.bots)) {
                    if (this.lead.statistics.bots[botId] == undefined) this.lead.statistics.bots[botId] = {};
                    var index = 1;
                    for (let [userId, value] of sort(value)) {
                        this.lead.statistics.bots[botId][userId] = defaultStats(value, index);
                        index++;
                    }
                }
                this.lead.statistics.types = {};
                this.lead.statistics.channels = {};
                for (let [typeName, channels] of Object.entries(data.types)) {
                    if (this.lead.statistics.types[typeName] == undefined) this.lead.statistics.types[typeName] = {};
                    for (let [channelId, value] of Object.entries(channels)) {
                        if (this.lead.statistics.types[typeName][channelId] == undefined) this.lead.statistics.types[typeName][channelId] = {};
                        var index = 1;
                        for (let [userId, _value] of sort(value)) {
                            this.lead.statistics.types[typeName][channelId][userId] = defaultStats(_value, index);
                            index++;
                        }
                    }
                }
            }
        }

        this.lead.statistics.channels = {};
        for (let [typeName, channels] of Object.entries(this.lead.statistics.types)) {
            for (let [channelId, data] of Object.entries(channels)) {
                if (this.lead.statistics.channels[channelId] == undefined) this.lead.statistics.channels[channelId] = {};
                for (let [userId, userData] of Object.entries(data)) {
                    if (this.lead.statistics.channels[channelId][userId] == undefined) this.lead.statistics.channels[channelId][userId] = 0;
                    this.lead.statistics.channels[channelId][userId] += userData.value;
                }
            }
        }
        for (let [channelId, data] of Object.entries(this.lead.statistics.channels)) {
            var index = 1;
            for (let [userId, value] of sort(data)) {
                value = defaultStats(value, index);
            }
        }

        // if (this.lead.statistics.types[typeName][channelId] == undefined) this.lead.statistics.types[typeName][channelId] = {}; 
        // this.lead.statistics.channels[channelId][userId] = defaultStats(_value, index);

        for (let [key, value] of Object.entries(this.lead)) {
            if (key != 'lead') this[key] = value;
        }

        return this;
    }
}