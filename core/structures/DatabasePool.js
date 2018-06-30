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
    
        this.guildssettings = this.define('guildssettings', {
            guildId: { 
                type: Sequelize.TEXT('tiny'), 
                primaryKey: true 
            },
            prefix: {
                type: Sequelize.TEXT('tiny'),
                defaultValue: config.bot.defaultPrefix   
            },
            defaultPerms: {
                type: Sequelize.MEDIUMINT(9),
                defaultValue: config.bot.defaultGuildPerms   
            },
            settings: {
                type: Sequelize.TEXT,
                defaultValue: '{}'
            }
        });
    
        this.users = this.define('users', {
            userId: { 
                type: Sequelize.TEXT('tiny'), 
                primaryKey: true
            },
            guildId: Sequelize.TEXT('tiny'),
            botPerms: {
                type: Sequelize.MEDIUMINT(6),
                defaultValue: config.bot.defaultBotPerms   
            },
            guildPerms: Sequelize.MEDIUMINT(6),
            lastMessageInfos: {
                type: Sequelize.TEXT('tiny'),
                defaultValue: '{}'   
            },
            statistics: {
                type: Sequelize.TEXT('medium'),
                defaultValue: JSON.stringify({
                    total: 0,
                    types: {
                        chat: { total: 0 },
                        bots: { total: 0 },
                        others: 0
                    },
                    bots: {}, times: {}
                })   
            },
            xp: {
                type: Sequelize.BIGINT(20),
                defaultValue: 0,
            },
            ether: {
                type: Sequelize.DECIMAL(20, 10),
                defaultValue: 1000  
            },
            token: {
                type: Sequelize.BIGINT(20),
                defaultValue: 0   
            },
            activityPoints: {
                type: Sequelize.DECIMAL(20, 10),
                defaultValue: 1   
            },
            boosts: {
                type: Sequelize.TEXT,
                defaultValue: '{}'   
            },
            inventory: {
                type: Sequelize.TEXT,
                defaultValue: '{}'   
            },
            settings: {
                type: Sequelize.TEXT,
                defaultValue: '{}'   
            },
            dailyTimestamp: Sequelize.BIGINT(20),
            updatedTimestamp: Sequelize.DATE
        });
    }
}