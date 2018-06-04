exports.run = function(bot, message, args) {
    const poolQuery = require('./../functions/database/poolQuery');
    const Discord = require('discord.js');
    const util = require('util');
    try {
        poolQuery(args.join(' ')).then(result => {
            message.channel.send(util.inspect(result, false, null), {code:"xl"}).catch(err => {
                const embed = new Discord.RichEmbed()
                    .setTitle(`Message Sending Error`)
                    .addField(`Code`, err.code, true)
                    .addField(`Path`, err.path, true)
                    .setColor('RED');
                message.channel.send({embed});
            })
        }).catch(err => {
            message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
        })
    } catch (err) {
        message.channel.send(`An error occured.\n\`\`\`xl\n${err}\n\`\`\``);
    }
}

exports.infos = {
    name: "Database Query",
    perms: {
        bot: 8,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Admin",
    description: "Queries database"
}