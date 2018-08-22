const poolQuery = require('../../functions/database/poolQuery');
const Perms = require('./../Tranquility/Perms');
module.exports = function(BaseGuildMember) {
    return class GuildMember extends BaseGuildMember {
        constructor(client, data, guild) {
            super(client, data, guild);
            if (!this.user.bot) {
                this.client.dbPool.users.findOne({ where: { userId: this.user.id, guildId: this.guild.id } }).then(userData => {
                    if (userData == null) {
                        this.client.dbPool.users.create({
                            userId: this.user.id,
                            guildId: this.guild.id,
                            guildPerms: this.guild.defaultPerms
                        }).then((userData) => {
                            this.build(userData.dataValues);
                        })
                    } else {
                        this.build(userData.dataValues);
                    }
                });
            }
        }

        build(userData) {
            for (let [key, value] of Object.entries(userData)) this[key] = value;
            this.perms = {
                bot: new Perms(this.botPerms, require('./../../data/perms.json')),
                guild: new Perms(this.guildPerms, require('./../../data/guildPerms.json'))
            }
            this.statistics = JSON.parse(userData.statistics);
            this.lastMessageInfos = JSON.parse(userData.lastMessageInfos);
            this.lastMessages = [];
        }
    
        async updateStatistics(message) {
            const currentTime = new Date();
            if (message.content.indexOf(this.guild.prefix) == 0) {
                this.statistics.bots[this.client.user.id] == undefined ? this.statistics.bots[this.client.user.id] = 1 : this.statistics.bots[this.client.user.id]++;
                this.statistics.types.bots[message.channel.id] == undefined ? this.statistics.types.bots[message.channel.id] = 1 : this.statistics.types.bots[message.channel.id]++;
                this.statistics.types.bots.total++;
            } else {
                const collected = await message.channel.awaitMessages(msg => msg.author.bot, {time: 1000, max: 1});
                const statistics_wordsForOthers = require('./../../data/statistics/wordsForOthers.json');
                for (let element of statistics_wordsForOthers) {
                    if (collected.first() != undefined ? message.content.indexOf(element) != -1 || collected.first().content.indexOf(element) != -1 : message.content.indexOf(element) != -1) {
                        this.statistics.types.others++;
                    }
                }
                
                if (collected.size > 0) {
                    this.statistics.bots[collected.first().author.id] == undefined ? this.statistics.bots[collected.first().author.id] = 1 : this.statistics.bots[collected.first().author.id]++;
                    this.statistics.types.bots[message.channel.id] == undefined ? this.statistics.types.bots[message.channel.id] = 1 : this.statistics.types.bots[message.channel.id]++;
                    this.statistics.types.bots.total++;
                } else { 
                    this.statistics.types.chat[message.channel.id] == undefined ? this.statistics.types.chat[message.channel.id] = 1 : this.statistics.types.chat[message.channel.id]++;
                    this.statistics.types.chat.total++;
                }
            }
            
            if (this.updatedTimestamp != undefined) {
                var xpReward = 0;
                const timeDifference = new Date().getTime() - new Date(this.updatedTimestamp).getTime();
                if (timeDifference <= 4000) xpReward = 0;
                else if (timeDifference <= 10000) xpReward = 1;
                else if (timeDifference <= 15000) xpReward = 2;
                else if (timeDifference <= 20000) xpReward = 3;
                else if (timeDifference <= 30000) xpReward = 5;
                else if (timeDifference <= 45000) xpReward = 8;
                else if (timeDifference <= 60000) xpReward = 13;
                this.xp += xpReward;
        
                this.lastMessages.unshift(message.content);
                if (this.lastMessages.length == 4) delete this.lastMessages[3];
                this.lastMessageInfos = {
                    id: message.id,
                    channel: message.channel.id,
                    createdTimestamp: message.createdTimestamp
                }
        
                this.activityPoints *= 1 - (0.0000000015 * timeDifference);
                if (this.activityPoints <= 0) this.activityPoints = 0;
                this.ether += timeDifference / 1000000 * this.activityPoints;
            }
    
            const dateFormat = `${currentTime.getUTCFullYear()}-${currentTime.getUTCMonth()}-${currentTime.getUTCDate()} ${currentTime.getUTCHours()}:${currentTime.getUTCMinutes()}`;
            if (this.statistics.times[dateFormat] == undefined) this.activityPoints++;
            this.statistics.times[dateFormat] = this.statistics.times[dateFormat] != undefined ? this.statistics.times[dateFormat]++ : this.statistics.times[dateFormat] = 1;
            this.statistics.total++;
            
            this.ether = parseFloat(this.ether);
            this.client.dbPool.users.update({
                statistics: JSON.stringify(this.statistics),
                lastMessageInfos: JSON.stringify(this.lastMessageInfos),
                xp: this.xp,
                ether: this.ether,
                activityPoints: this.activityPoints
            }, { where: {
                    userId: this.user.id,
                    guildId: this.guild.id
                }
            }).then(() => {
                this.updatedTimestamp = new Date();
            });
        }

        addToken(number) {
            this.token += number;
            this.client.dbPool.users.update({
                token: this.token
            }, { where: {
                userId: this.user.id,
                guildId: this.guild.id
            }}).then(() => {
                this.updatedTimestamp = new Date();
            });
        }
    }
}
