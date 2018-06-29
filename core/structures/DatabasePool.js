const config = require('./../../config.json');
const Sequelize = require('sequelize');
module.exports = class DatabasePool extends Sequelize {
    constructor() {
        super(config.mysql.database, config.mysql.user, config.mysql.password, {
            dialect: 'mysql',
            host: 'localhost',
            port: 3306,
            logging: false,
            define: {
                timestamps: false
            }
        });
    
        this.GuildSettings = this.define('guildsSettings', {
            guildId: { type: Sequelize.TEXT('tiny'), primaryKey: true },
            prefix: Sequelize.TEXT('tiny'),
            settings: Sequelize.TEXT
        });
    
        this.User = this.define('users', {
            userId: { type: Sequelize.TEXT('tiny'), primaryKey: true },
            guildId: Sequelize.TEXT('tiny'),
            botPerms: Sequelize.MEDIUMINT(6),
            guildPerms: Sequelize.MEDIUMINT(6),
            lastMessageInfos: Sequelize.TEXT('tiny'),
            statistics: Sequelize.TEXT('medium'),
            xp: Sequelize.BIGINT(20),
            ether: Sequelize.DECIMAL(20, 10),
            token: Sequelize.BIGINT(20),
            activityPoints: Sequelize.DECIMAL(20, 10),
            boosts: Sequelize.TEXT,
            inventory: Sequelize.TEXT,
            settings: Sequelize.TEXT,
            dailyTimestamp: Sequelize.BIGINT(20),
            updatedTimestamp: Sequelize.DATE
        });
    }
}