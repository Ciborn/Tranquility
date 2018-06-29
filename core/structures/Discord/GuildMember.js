const poolQuery = require('../../functions/database/poolQuery');
const Perms = require('./../Tranquility/Perms');
module.exports = function(BaseGuildMember) {
    return class GuildMember extends BaseGuildMember {
        constructor(client, data, guild) {
            super(client, data, guild);
        }

        fetch(guild) {
            this.guild = guild;
            poolQuery(`SELECT * FROM users WHERE userId='${this.user.id}' AND guildId='${this.guild.id}'`).then(userData => {
                if (Object.keys(userData).length == 0) {
                    const statisticsModel = JSON.stringify({
                        total: 0,
                        types: {
                            chat: { total: 0 },
                            bots: { total: 0 },
                            others: 0
                        },
                        bots: {}, times: {}
                    });
                    poolQuery(`INSERT INTO users (userId, guildId, guildPerms, statistics, boosts, inventory, lastMessageInfos, settings) VALUES ('${this.user.id}', '${this.guild.id}', ${this.guild.defaultPerms}, '${statisticsModel}', '{}', '{}', '{}', '{}')`).then(() => {
                        this.fetch();
                    });
                } else {
                    for (let [key, value] of Object.entries(userData[0])) this.setProperty(key, value);
                    this.setProperty('perms', {
                        bot: new Perms(this.botPerms, require('./../../data/perms.json')),
                        guild: new Perms(this.guildPerms, require('./../../data/guildPerms.json'))
                    })
                    this.setProperty('statistics', JSON.parse(userData[0].statistics));
                    this.setProperty('lastMessageInfos', JSON.parse(userData[0].lastMessageInfos));
                    this.setProperty('lastMessages', []);
                }
            });
        }

        setProperty(key, value) {
            this[key] = value;
        }
    
        async updateStatistics(message) {
            if (this.statistics == undefined) this.fetch(message.guild);
            const statistics_wordsForOthers = require('./../../data/statistics/wordsForOthers.json');
            const collected = await message.channel.awaitMessages(msg => msg.author.bot, {time: 1000, max: 1});
    
            for (let element of statistics_wordsForOthers) {
                if (collected.first() != undefined ? message.content.indexOf(element) != -1 || collected.first().content.indexOf(element) != -1 : message.content.indexOf(element) != -1) {
                    this.statistics.types.others++;
                }
            }
            
            const currentTime = new Date();
            if (collected.size > 0) {
                this.statistics.bots[collected.first().author.id] == undefined ? this.statistics.bots[collected.first().author.id] = 1 : this.statistics.bots[collected.first().author.id]++;
                this.statistics.types.bots[message.channel.id] == undefined ? this.statistics.types.bots[message.channel.id] = 1 : this.statistics.types.bots[message.channel.id]++;
                this.statistics.types.bots.total++;
            } else { 
                this.statistics.types.chat[message.channel.id] == undefined ? this.statistics.types.chat[message.channel.id] = 1 : this.statistics.types.chat[message.channel.id]++;
                this.statistics.types.chat.total++;
            }
            
            var xpReward = 0;
            const timeDifference = new Date().getTime() - new Date(this.updatedTimestamp).getTime();
            if (timeDifference <= 4000) xpReward = 0;
            else if (timeDifference <= 10000) xpReward = 1;
            else if (timeDifference <= 15000) xpReward = 2;
            else if (timeDifference <= 20000) xpReward = 3;
            else if (timeDifference <= 30000) xpReward = 5;
            else if (timeDifference <= 45000) xpReward = 8;
            else if (timeDifference <= 60000) xpReward = 13;
            this.xp = this.xp + xpReward;
    
            this.lastMessages.unshift(message.content);
            if (this.lastMessages.length == 4) delete this.lastMessages[3];
            this.lastMessageInfos = {
                id: message.id,
                channel: message.channel.id,
                createdTimestamp: message.createdTimestamp
            }
    
            this.activityPoints *= 1 - (0.0000000015 * timeDifference);
            this.ether += timeDifference / 1000000 * this.activityPoints;
    
            const dateFormat = `${currentTime.getUTCFullYear()}-${currentTime.getUTCMonth()}-${currentTime.getUTCDay()} ${currentTime.getUTCHours()}:${currentTime.getUTCMinutes()}`;
            if (this.statistics.times[dateFormat] == undefined) this.activityPoints++;
            this.statistics.times[dateFormat] = this.statistics.times[dateFormat] != undefined ? this.statistics.times[dateFormat]++ : this.statistics.times[dateFormat] = 1;
            this.statistics.total++;
    
            poolQuery(`UPDATE users SET statistics='${JSON.stringify(this.statistics)}', lastMessage='${JSON.stringify(this.lastMessage)}', xp=${this.xp}, ether=${this.ether}, activityPoints=${this.activityPoints} WHERE userId='${this.user.id}' AND guildId='${this.guild.id}'`).then(() => {
                this.updatedTimestamp = new Date();
            }).catch(() => {});
            return this;
        }

    }
}