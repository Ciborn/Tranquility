const Discord = require('discord.js');
exports.run = function(bot, message, args) {
    const minutesUptime = `${String(Math.floor(bot.uptime%3600000/60000))}m`;
    var users = 0;
    for (let [guildId, data] of Object.entries(bot.cache.guilds)) users += Object.keys(data.members).length;
    const embed = new Discord.RichEmbed()
        .setAuthor(bot.user.username, bot.user.avatarURL)
        .setTitle('Informations on the Tranquility bot')
        .addField(`Developers`, `<@320933389513523220>\n<@310296184436817930>`, true)
        .addField(`Statistics`, `**Users** : **${users}**/${bot.users.size}\n**Servers** : **${Object.keys(bot.cache.guilds).length}**/${bot.guilds.size}`, true)
        .addField(`Resources`, `**Memory Usage** : ${Math.round(100 * process.memoryUsage().heapTotal/1000000) / 100} MB\n**Uptime** : ${Math.floor(bot.uptime/3600000)}h${minutesUptime.length == 2 ? '0' + minutesUptime : minutesUptime}`, true)
        .addField(`Host`, `**Raspberry Pi 3** at **Ciborn**'s home`, true)
        .addField(`Prefix in this guild`, `**${message.member.guild.prefix}**`, true)
        .setThumbnail(message.guild.iconURL)
        .setColor(`BLUE`);
    message.channel.send({embed: embed});
}

exports.infos = {
    name: "Info Page",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Bot",
    description: "Shows infos about the bot"
}