exports.run = function(bot, message, args) {
    const poolQuery = require('./../functions/database/poolQuery');
    const Discord = require('discord.js');
    const util = require('util');
    try {
        poolQuery(args.join(' ')).then(result => {
            message.channel.send(util.inspect(result, false, null), {code:"xl"}).catch(err => {
                require('fs').writeFileSync(`./cache/files/${message.id}.txt`, require('util').inspect(result, false, null), {encoding: 'utf8'});
                message.channel.send(`The result was too long to be sent on Discord. Everything is in the attachment.`, {
                    files: [`./cache/files/${message.id}.txt`]
                });
            });
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