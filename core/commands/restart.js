exports.run = function(bot, message, args) {
    const { MessageEmbed } = require('discord.js');
    const config = require('./../../config.json');
    const embed = new MessageEmbed()
        .setTitle(`Restarting ${bot.user.username}`)
        .setDescription(`Please wait, this may take up to 15 seconds.`)
        .setColor('ORANGE');
    message.channel.send({embed}).then(msg => {
        bot.destroy().then(() => {
            bot.cache = {};
            bot.login(config.bot.token).then(() => {
                const embed = new MessageEmbed()
                    .setTitle(`Restarting ${bot.user.username}`)
                    .setDescription(`Successfully restarted the bot.`)
                    .setColor('GREEN');
                msg.delete();
                message.channel.send(embed);
            })
        }).catch(err => {
            const embed = new MessageEmbed()
                .setTitle(`Restarting ${bot.user.username}`)
                .setDescription(`An unknown error occured.`)
                .setColor('RED');
            msg.delete();
            message.channel.send(embed);
        })
    })
}

exports.infos = {
    name: "Bot Restart",
    perms: {
        bot: 64,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Admin",
    description: "Restarts the bot"
}