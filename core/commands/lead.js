const Discord = require('discord.js');
exports.run = async function(bot, message, args) {
    const binds = {
        xp: ['xp', 'XP', 'Experience'],
        ap: ['activityPoints', 'APs', 'Activity Points'],
        ether: ['ether', 'Ether', 'Ether'],
        token: ['token', 'Token', 'Token']
    }

    var leaderboard = '';
    var leadPart = binds[args[0]] != undefined ? message.member.guild.leaderboard[binds[args[0]][0]] : 'xp';

    if (message.mentions.members.size == 1) {
        const mention = message.mentions.members.first();
        if (mention.user.bot) leadPart = message.member.guild.leaderboard.statistics.bots[mention.id];
        args[0] = mention.id;
        binds[mention.id] = [null, 'Messages', `Bot Usage of ${(await bot.fetchUser(mention.id).username)}`];
    } else if (message.mentions.channels.size == 1) {
        const mention = message.mentions.channels.first();
        leadPart = message.member.guild.leaderboard.statistics.channels[mention.id];
        args[0] = mention.id;
        binds[mention.id] = [null, 'Messages', `Messages in #${bot.channels.get(mention.id).name}`];
    }

    for (let [userId, data] of Object.entries(leadPart)) {
        var rank = data.rank;
        if (rank == 1) leaderboard += `\n**Top 3**\n`;
        if (rank == 4) leaderboard += `\n**Top 10**\n`;
        
        if (rank == 1) rank = ':first_place:';
        else if (rank == 2) rank = ':second_place:';
        else if (rank == 3) rank = ':third_place:';
        else rank = `**\`${rank}\`.**`;

        leaderboard += `${rank} <@${userId}> - **${data.value}** ${binds[args[0] || 'xp'][1]}\n`;
    }

    const embed = new Discord.RichEmbed()
        .setTitle(`Leaderboards - ${binds[args[0] || 'xp'][2]}`)
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
    enabled: `Disabled because in WIP`,
    category: "Activity",
    description: "Shows guild's leaderboard"
}