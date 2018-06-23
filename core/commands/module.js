exports.run = function(bot, message, args) {
    if (args.length >= 2) {
        if (args[0] == 'unload') {
            delete require.cache[require.resolve(`./../${args[1]}.js`)];
            message.channel.send(`The file **${args[1]}** has been unloaded, **${message.author.username}**.`);
        }
    } else {
        message.channel.send(`You need to specify the action you want to perform and on what file, **${message.author.username}**.`);
    }
}

exports.infos = {
    name: "Module Management",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Admin",
    description: "Manages the modules of the bot"
}