const Discord = require('discord.js');
const numeral = require('numeral');
exports.run = function(bot, message, args) {
    var botMessages = 0, usedChannels = '', usedBots = '', usedChannelsObject = {}, usedChannelsMap = new Map(), usedBotsObject = {}, usedBotsMap = new Map();
    for (let [channel, number] of Object.entries(message.member.statistics.bots)) botMessages += number;
    for (let [channel, number] of Object.entries(message.member.statistics.types.chat)) if (channel != 'total') { usedChannelsObject[channel] == undefined ? usedChannelsObject[channel] = number : usedChannelsObject[channel] += number; }
    for (let [channel, number] of Object.entries(message.member.statistics.types.bots)) if (channel != 'total') { usedChannelsObject[channel] == undefined ? usedChannelsObject[channel] = number : usedChannelsObject[channel] += number; }
    for (let [channel, number] of Object.entries(usedChannelsObject)) usedChannelsMap.set(channel, number);
    usedChannelsMap[Symbol.iterator] = function* () { yield* [...this.entries()].sort((a, b) => b[1] - a[1]) };
    for (let [channel, number] of usedChannelsMap) usedChannels += `<#${channel}> : **${numeral(number).format('0,0')}** messages \`(${Math.round(10 * number * 100 / (message.member.statistics.types.chat.total + message.member.statistics.types.bots.total)) / 10}%)\`\n`;
    
    for (let [userBot, number] of Object.entries(message.member.statistics.bots)) usedBotsObject[userBot] == undefined ? usedBotsObject[userBot] = number : usedBotsObject[userBot] += number;
    for (let [userBot, number] of Object.entries(usedBotsObject)) usedBotsMap.set(userBot, number);
    usedBotsMap[Symbol.iterator] = function* () { yield* [...this.entries()].sort((a, b) => b[1] - a[1]) };
    for (let [userBot, number] of usedBotsMap) usedBots += `<@${userBot}> : **${numeral(number).format('0,0')}** messages \`(${Math.round(10 * number * 100 / botMessages) / 10}%)\`\n`;

    var embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle('User Activity Statistics')
        .addField('General', `**${numeral(message.member.statistics.total).format('0,0')}** messages`, true)
        .addField('Chatting', `**${numeral(message.member.statistics.types.chat.total).format('0,0')}** messages \`(${Math.round(10 * message.member.statistics.types.chat.total * 100 / message.member.statistics.total) / 10}%)\``, true)
        .addField('Bots Usage', `**${numeral(botMessages).format('0,0')}** messages \`(${Math.round(10 * botMessages * 100 / message.member.statistics.total) / 10}%)\``, true)
        .addField('Most Active Channels', usedChannels.split('\n', 5).join('\n'), true)
        .addField('Most Used Bots', usedBots.split('\n', 5).join('\n'), true)
        .setColor(message.member.highestRole.color)
        .setFooter(`${message.guild.name}  •  Last Message in #${message.guild.channels.find('id', message.member.lastMessage.channel).name} on`, message.guild.iconURL)
        .setTimestamp(new Date(message.member.lastMessage.createdTimestamp));
    message.channel.send({embed});
}

exports.infos = {
    name: "User Statistics",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Activity",
    description: "Shows user's statistics"
}