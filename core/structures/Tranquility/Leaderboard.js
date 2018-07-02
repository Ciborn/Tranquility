const fs = require('fs');
module.exports = class GuildLeaderboard {
    constructor(members) {
        const returnLead = function(map) {

        }
        const dataModel = function(value, index) {
            return {
                rank: index == undefined ? 0 : index,
                value: value
            }
        }
        for (let [userId, member] of members) {
            if (member.statistics == undefined) return;
            for (let property of ['xp', 'ether', 'token', 'activityPoints', 'statistics']) {
                if (this[property] == undefined) this[property] = {};
                if (property == 'statistics') {
                    for (let [type, data] of Object.entries(member.statistics)) {
                        if (this.statistics[type] == undefined) this.statistics[type] = {};
                        if (type == 'types') {
                            for (let [type, values] of Object.entries(data)) {
                                if (this.statistics.types[type] == undefined) this.statistics.types[type] = {};
                                if (type != 'others') {
                                    for (let [type, data] of Object.entries(values)) {
                                        for (let [id, value] of Object.entries(data)) {
                                            if (this.statistics.types[type][id] == undefined) this.statistics.types[type][id] = {};
                                            this.statistics.types[type][id][userId] = dataModel(value);
                                        }
                                    }
                                } else {
                                    this.statistics.types.others[userId] = dataModel(member.statistics.types.others);
                                }
                            }
                        } else if (type == 'bots') {
                            for (let [botId, value] of Object.entries(data)) {
                                if (this.statistics.bots[botId] == undefined) this.statistics.bots[botId] = {};
                                this.statistics.bots[botId][userId] = dataModel(value);
                            }
                        } else if (type == 'total') {
                            this.statistics.total[userId] = dataModel(member.statistics.total);
                        }
                    }
                } else {
                    this[property][userId] = dataModel(member[property]);
                }
            }
        }
    }
}