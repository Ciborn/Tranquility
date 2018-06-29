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

bot.on('ready', () => {
    require('./core/events/ready')(bot);
});

bot.on('message', message => {
    require('./core/events/message')(bot, message);
});

bot.login(config.bot.token);