const poolQuery = require('./../functions/database/poolQuery');
const Cache = require('./../structures/Cache');
exports.run = function(bot, message, args) {
    const money = parseInt(args[1]);
    if (args.length == 2 && !isNaN(money)) {
        if (message.member.ether >= money) {
            const userId = message.mentions.members.size == 1 ? message.mentions.members.first().id : args[0];
            if (userId != message.author.id) {
                bot.fetchUser(userId).then(receiver => {
                    poolQuery(`SELECT * FROM users WHERE userId='${userId}'`).then(result => {
                        if (Object.keys(result).length != 0) {
                            poolQuery(`UPDATE users SET ether=${result[0].ether + money} WHERE userId='${userId}'`).then(async () => {
                                const senderCache = new Cache(message.member.guild.id, message.author.id);
                                const receiverCache = new Cache(message.member.guild.id, userId);
                                if (receiverCache.get('ether') != undefined) receiverCache.set('ether', result[0].ether + money);
                                message.member.ether -= money; senderCache.set('ether', message.member.ether);
                                message.channel.send(`You successfully transferred **${money} Ether** from your money to **${receiver.username}**, **${message.author.username}**.`)
                            });
                        } else {
                            message.channel.send(`I am sure that your friend **${receiver.username}** exists, but I cannot find it anywhere, **${message.author.username}**. I would be happy if he came to me so we know each other!`);
                        }
                    });
                }).catch(err => {
                    message.channel.send(`You specified a user who does not exist on Discord, **${message.author.username}**, make sure the user ID specified is valid.`);
                });
            } else {
                message.channel.send(`You cannot give money to yourself, **${message.author.username}**.`);
            }
        } else {
            message.channel.send(`You really thought you were able to donate more than what you have, **${message.author.username}**?`);
        }
    } else {
        message.channel.send(`You gotta need to specify to who you need to transfer money and how much to continue, **${message.author.username}**.`);
    }
}

exports.infos = {
    name: "Ether Donation",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Activity",
    description: "Donates your Ether"
}