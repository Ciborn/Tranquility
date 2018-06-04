const Discord = require('discord.js');
exports.run = function(bot, message, args) {
    const embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle('User Activity Statistics')
        .addField('General', ':)', true)
        .addField('Chatting', 'heya', true)
        .addField('Bots Usage', 'hmm', true)
        .addField('Most Active Channels', 'pfff', true)
        .addField('Most Used Bots', 'dunno', true)
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