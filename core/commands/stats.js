const Discord = require('discord.js');
const htmlConvert = require('html-convert');
const fs = require('fs');
exports.run = function(bot, message, args) {
    var botMessages = 0, usedChannels = '', usedChannelsObject = {};
    for (let [channel, number] of Object.entries(message.member.statistics.bots)) botMessages += number;
    for (let [channel, number] of Object.entries(message.member.statistics.types.chat)) usedChannelsObject[channel] == undefined ? usedChannelsObject[channel] = number : usedChannelsObject[channel] += number;
    for (let [channel, number] of Object.entries(message.member.statistics.types.bots)) usedChannelsObject[channel] == undefined ? usedChannelsObject[channel] = number : usedChannelsObject[channel] += number;
    for (let [channel, number] of Object.entries(usedChannelsObject)) usedChannels += `<#${channel}> : **${number}** messages \`(${Math.round(10 * number * 100 / (message.member.statistics.types.chat.total + message.member.statistics.types.bots.total)) / 10}%)\`\n`;
    usedChannels = usedChannels.replace(usedChannels.split('\n').shift(), '');

    var embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle('User Activity Statistics')
        .addField('General', `**${message.member.statistics.total}** messages`, true)
        .addField('Chatting', `**${message.member.statistics.types.chat.total}** messages \`(${Math.round(10 * message.member.statistics.types.chat.total * 100 / message.member.statistics.total) / 10}%)\``, true)
        .addField('Bots Usage', `**${botMessages}** messages \`(${Math.round(10 * botMessages * 100 / message.member.statistics.total) / 10}%)\``, true)
        .addField('Most Active Channels', usedChannels, true)
        .addField('Most Used Bots', 'dunno', true)
        .setColor(message.member.highestRole.color)
        .setFooter(message.guild.name, message.guild.iconURL);
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