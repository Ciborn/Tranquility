const Leaderboard = require('./../Tranquility/Leaderboard');
module.exports = function(BaseGuild) {
    return class Guild extends BaseGuild {
        constructor(client, data) {
            super(client, data);
            this.client.dbPool.guildssettings.findOne({ where: { guildId: this.id } }).then(guildData => {
                if (guildData == null) {
                    this.client.dbPool.guildssettings.create().then((guildData) => {
                        this.build(guildData.dataValues);
                    });
                } else {
                    this.build(guildData.dataValues);
                }
            });
        }

        build(guildData) {
            for (let [key, value] of Object.entries(guildData)) this[key] = value;
        }

        get leaderboard() {
            return new Leaderboard(this.members);
        }
    }
}