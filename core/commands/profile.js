const Discord = require('discord.js');
exports.run = function(bot, message, args) {
    const levelData = require('./../functions/activity/computeLevel')(message.member.xp);
    const progression = `**Level ${levelData[0]}**${levelData[0] == 0 ? '' : ` - ${message.member.xp} XP / ${levelData[3]} XP \`(${Math.round(10 * (100 - (levelData[2] * 100 / levelData[1]))) / 10}%)\``}`; 
    const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`User Activity Profile`)
        .addField(`Ranking`, `\`[${0}]\` **#${0}** / ${0}`, true)
        .addField(`Ether`, `${Math.floor(message.member.ether)}`, true)
        .addField(`Tokens`, `${message.member.token} Tokens`, true)
        .addField(`Progression`, progression, true)
        .addField(`Activity Points`, `**${Math.round(100 * message.member.activityPoints) / 100} APs**`, true)
        .setColor(message.member.highestRole.color)
        .setFooter(message.guild.name, message.guild.iconURL);
    message.channel.send({embed});
}

exports.infos = {
    name: "User Profile",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Activity",
    description: "Shows user's profile"
}