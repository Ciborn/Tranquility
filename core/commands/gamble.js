const Cache = require('./../structures/Cache');
const Discord = require('discord.js');
exports.run = function(bot, message, args) {
    args[0] = parseInt(args[0]);
    if (args.length != 0 && args[0] == undefined ? false : !isNaN(args[0])) {
        if (message.member.ether <= args[0]) {
            message.channel.send(`You really thought you were able to gamble more than what you have, **${message.author.username}**?`);
        } else {
            const result = Math.random();
            const cache = new Cache(message.member.guild.id, message.author.id);
            if (result < 0.49) {
                cache.set('ether', message.member.ether - args[0]);
                message.member.ether -= args[0];
                message.channel.send(`RIP, you lost your money, but it's only **${args[0]} Ether**, **${message.author.username}**, maybe retry to lose more?`);
            } else {
                cache.set('ether', message.member.ether + args[0]);
                message.member.ether += args[0];
                message.channel.send(`Nice, you just made **${args[0]} Ether**, **${message.author.username}**, try to get some more?`);
            }
        }
    } else {
        message.channel.send(`**${message.author.username}**, you gotta put the number of ether you wanna gamble to continue (and a valid one).`);
    }
}

exports.infos = {
    name: "Ether Gambling",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Activity",
    description: "Gambles your Ether"
}