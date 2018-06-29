const { MessageEmbed } = require('discord.js');
const fs = require('fs');
exports.run = function(bot, message, args) {
    if (args.length == 0) {
        fs.readdir(`./core/commands/`, {encoding: 'utf8'}, (err, files) => {
            var commands = {};
            for (let fileName of files) {
                if (fileName.indexOf('.js') != -1) {
                    let command = require(`./${fileName}`).infos;
                    if (commands[command.category] == undefined) commands[command.category] = '';
                    commands[command.category] += `**${message.member.guild.prefix}${fileName.replace('.js', '')}** : ${command.description}\n`;
                }
            }

            var embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`${bot.user.username} Help Pages`)
                .setColor(`BLUE`);

            for (let [category, list] of Object.entries(commands)) {
                if (category == 'Admin') {
                    if (message.member.perms.bot.has('SHOW_ADMIN_COMMANDS')) embed.addField(category, list);
                } else {
                    embed.addField(category, list);
                }
            }
            message.channel.send({embed});
        });
    } else {
        try {
            const command = require(`./${args[0]}`).infos;
        } catch(err) {
            message.channel.send(`This command is unknown, **${message.author.username}**, check help pages to see existing commands.`);
        }
    }
}

exports.infos = {
    name: "Help Pages",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Bot",
    description: "Shows help pages"
}