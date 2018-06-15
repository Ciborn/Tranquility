const Discord = require('discord.js');
exports.run = function(bot, message, args) {
    const lead = JSON.parse(require('fs').readFileSync(`./cache/${message.guild.id}/lead.json`));

    const binds = {
        xp: [message.member.guild.lead.xp, 'XP']
    }

    var leadType = args[0] == undefined ? 'xp' : args[0].toLowerCase();
    var leaderboard = '';
    for (let [userId, data] of Object.entries(binds[leadType][0])) {
        if (data.rank == 1) leaderboard += `\n**Top 3**\n`;
        if (data.rank == 4) leaderboard += `\n**Top 10**\n`;
        
        if (data.rank == 1) data.rank = ':first_place:';
        else if (data.rank == 2) data.rank = ':second_place:';
        else if (data.rank == 3) data.rank = ':third_place:';
        else data.rank = `**\`${data.rank}\`.**`;

        leaderboard += `${data.rank} <@${userId}> - **${data.value}** ${binds[leadType][1]}\n`;
    }

    const embed = new Discord.RichEmbed()
        .setTitle(`Leaderboards - ${binds[args[0] || 'xp'][1]}`)
        .setDescription(leaderboard.split('\n', 14).join('\n'))
        .setFooter(`${message.guild.name}  •  Last Updated`, message.guild.iconURL)
        .setTimestamp(new Date())
        .setColor(`PURPLE`);
    message.channel.send({embed});
}

exports.infos = {
    name: "Server Leaderboard",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Activity",
    description: "Shows guild's leaderboard"
}