const Discord = require('discord.js');
const bot = new Discord.Client();
const config = require('./config.json');
bot.login(config.bot.token);

bot.on('ready', () => {
    require('rimraf')('./cache', (err) => {
        err != null ? console.error(err) : null;
    });
    require('./core/events/ready')(bot);
});

bot.on('message', message => {
    require('./core/events/message')(bot, message);
});