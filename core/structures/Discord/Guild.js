const config = require('./../../../config.json');
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
            // this.leaderboard = await new Leaderboard(this.id).init();
        }
    }
}