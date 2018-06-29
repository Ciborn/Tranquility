const { MessageEmbed } = require('discord.js');
const numeral = require('numeral');
exports.run = function(bot, message, args) {
    const levelData = require('./../functions/activity/computeLevel')(message.member.xp);
    const progression = `**Level ${levelData[0]}**${levelData[0] == 0 ? '' : ` - ${numeral(message.member.xp).format('0,0')} XP / ${numeral(levelData[3]).format('0,0')} XP \`(${Math.round(10 * (100 - (levelData[2] * 100 / levelData[1]))) / 10}%)\``}`;

    const determineRank = function(index, total) {
        var rank = '';
        if (index * 100 / total <= 1) rank = 'S+';
        else if (index * 100 / total <= 3) rank = 'S';
        else if (index * 100 / total <= 6) rank = 'S-';
        else if (index * 100 / total <= 11) rank = 'A+';
        else if (index * 100 / total <= 18) rank = 'A';
        else if (index * 100 / total <= 33) rank = 'B+';
        else if (index * 100 / total <= 42) rank = 'B';
        else if (index * 100 / total <= 57) rank = 'C';
        else if (index * 100 / total <= 77) rank = 'C-';
        else if (index * 100 / total <= 100) rank = 'D';
        return rank;
    }

    const lead = message.member.guild.leaderboard;
    const rankingInfos = [lead.xp[message.author.id].rank, Object.keys(lead.xp).length]; rankingInfos.push(determineRank(rankingInfos[0], rankingInfos[1]));
    const embed = new MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`User Activity Profile`)
        .addField(`Ranking`, `\`[${rankingInfos[2]}]\` **#${rankingInfos[0]}** / ${rankingInfos[1]}`, true)
        .addField(`Ether`, `${numeral(Math.floor(message.member.ether)).format('0,0')}`, true)
        .addField(`Tokens`, `${message.member.token} Tokens`, true)
        .addField(`Progression`, progression, true)
        .addField(`Activity Points`, `**${numeral(message.member.activityPoints).format('0,0.00')} APs**`, true)
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