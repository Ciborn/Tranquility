const Bot = require('./core/structures/Bot');
const config = require('./config.json');
const bot = new Bot();
bot.login(config.bot.token);

bot.on('ready', () => {
    require('rimraf')('./cache', (err) => {
        if (err != null) console.error(err);
    });
    require('./core/events/ready')(bot);
    bot.cache = {};
});

bot.on('message', message => {
    require('./core/events/message')(bot, message);
});