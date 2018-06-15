const poolQuery = require('./../functions/database/poolQuery');
const Cache = require('./../structures/Cache');
const tips = require('./../data/tips.json');
exports.run = async function(bot, message, args) {
    const cache = new Cache(message.guild.id, message.author.id);
    if (message.member.dailyTimestamp == null) message.member.dailyTimestamp = new Date().getTime() - 72000000;
    if (new Date().getTime() - new Date(message.member.dailyTimestamp).getTime() >= 72000000) {
        const receivedMoney = message.member.ether + Math.round(500 + Math.random() * 100);
        cache.set('ether', receivedMoney);
        cache.set('dailyTimestamp', new Date().getTime());

        message.channel.send(`Congratulations, **${message.author.username}**, you successfully claimed your daily reward! You got **${receivedMoney - message.member.ether} Ether**.\nHere is a **TIP** to have a better experience of myself : ${tips[Math.floor(Math.random() * tips.length)]}`);

        message.member.ether = receivedMoney;
        poolQuery(`UPDATE users SET dailyTimestamp='${new Date().getTime()}' WHERE userId='${message.author.id}' AND guildId='${message.member.guild.id}'`);
    } else {
        message.channel.send(`You cannot receive your daily reward now, **${message.author.username}**, please wait __***S O M E  T I M E***__ (${72000000 - (new Date().getTime() - new Date(message.member.dailyTimestamp).getTime())} milliseconds if ya wanna know).`);
    }
}

exports.infos = {
    name: "Daily Rewards",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Activity",
    description: "Rewards you Ether each 20 hours"
}