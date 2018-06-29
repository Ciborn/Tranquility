const config = require('./../../config.json');
const fs = require('fs');
module.exports = function(bot) {
    require('rimraf')('./cache', (err) => {
        if (err != null) return console.error(err);
        fs.mkdirSync('./cache');
        fs.mkdirSync('./cache/files/');
        fs.mkdirSync('./cache/errors/');
    });
    console.log(` - Started ${bot.user.username} with the ID ${bot.user.id}`);
    var guildsSize = bot.guilds.size;
    var gameNames = [
        {type: 0, name: `Use %#info`},
        {type: 0, name: `Hello there!`},
        {type: 0, name: `with ${bot.users.size} members`},
        {type: 0, name: `with ${bot.guilds.size} servers`},
        {type: 0, name: `on version ${config.bot.version}`}
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