exports.run = function(bot, message, args) {
    if (args.length >= 2) {
        var supportedUserWords = ['user', 'profile', 'player'];
        if (supportedUserWords.indexOf(args[0]) != -1) {
            require('./osu/profile')(bot, message, args);
        } else if (args.indexOf('best') != -1) {
            require('./osu/best')(bot, message, args);
        } else {
            message.channel.send(`You requested informations that I can not retrieve for now, **${message.author.username}**.`);
        }
    } else {
        message.channel.send(`Sorry **${message.author.username}**, but you did not specify enough arguments.`);
    }
}

exports.infos = {
    name: "osu! Statistics",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Miscellaneous",
    description: "Shows osu! player's statistics, (__user__ profile or __best__ plays)"
}