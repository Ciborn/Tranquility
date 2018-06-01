const config = require('./../../config.json');
module.exports = function(bot) {
    console.log(` - Started ${bot.user.username} with the ID ${bot.user.id}`)
    var guildsSize = bot.guilds.size;
    var gameNames = [
        new Object({type: 3, name: `Tranquility Playing DRPG`}),
        new Object({type: 0, name: `Use %#info`}),
        new Object({type: 0, name: `Hello there!`}),
        new Object({type: 0, name: `with ${bot.guilds.find('id', '379115766127001600').members.size} members`}),
        new Object({type: 0, name: `on version ${config.bot.version}`})
    ];

    const changeGame = function() {
        guildsSize = bot.guilds.size;
        if (bot.user.presence.status == 'online') {
            bot.user.setPresence({
                status: 'online',
                game: gameNames[Math.floor(Math.random() * gameNames.length)]
            });
        }
    }

    setInterval(changeGame, 30000);
}