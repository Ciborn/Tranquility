const { MessageEmbed } = require('discord.js');
exports.run = (bot, message, args) => {
    if (args[0] == 'give') {
        if (args[2] != undefined) {
            if (message.mentions.members.size === 1) {
                if (message.member.perms.guild.has('SEND_UNLIMITED_TOKEN')) {
                    message.mentions.members.first().addToken(parseInt(args[2]));
                    message.channel.send(`You gave **${args[2]} token${args[2] > 1 ? 's' : ''}** to **${message.mentions.members.first().user.username}**.`);
                } else {
                    if (message.member.perms.guild.has('SEND_LIMITED_TOKEN') || message.member.perms.guild.has('TRANSFER_TOKEN')) {
                        if (message.member.token >= args[2]) {
                            message.mentions.members.first().addToken(parseInt(args[2]));
                            message.member.addToken(-1 * parseInt(args[2]));
                            message.channel.send(`You gave **${args[2]} token${args[2] > 1 ? 's' : ''}** of your tokens to **${message.mentions.members.first().user.username}**.`);
                        } else {
                            message.channel.send(`You can't give what you don't have. Isn't it logic?`);
                        }
                    } else {
                        message.channel.send(`You're not allowed to give tokens to people.`);
                    }
                }
            } else {
                message.channel.send(`If you want to give someone a token, you gotta specify to who.`);
            }
        } else {
            message.channel.send(`Unless you want to give 0 token to your friend with a useless ping, you gotta specify how many tokens you wanna give him.`);
        }
    } else {
        message.channel.send(`I really don't know what you wanna do. Just keep giving tokens (\`${message.guild.prefix}token give\`) to people.`);
    }
}

exports.infos = {
    name: "Token Donation",
    perms: {
        bot: 1,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Activity",
    description: "Gives token(s)"
}