const { Structures } = require('discord.js');

Structures.extend('Guild', BaseGuild => {
    return require('./core/structures/Discord/Guild')(BaseGuild);
});

Structures.extend('GuildMember', BaseGuildMember => {
    return require('./core/structures/Discord/GuildMember')(BaseGuildMember);
});

const Bot = require('./core/structures/Bot');
const bot = new Bot();
const config = require('./config.json');

require('fs').readdir('./core/events/', (err, files) => {
    for (let fileName of files) {
        bot.on(fileName.split('.')[0], (...args) => require(`./core/events/${fileName}`)(bot, ...args));
    }
});

bot.login(config.bot.token);