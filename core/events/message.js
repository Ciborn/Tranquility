const Perms = require('./../structures/Tranquility/Perms');
const isEmpty = require('./../functions/utils/isEmpty');
const Guild = require('./../structures/Discord/Guild');
const BotError = require('./../structures/BotError');
const User = require('./../structures/Discord/User');
const Command = require('./../structures/Command');
const Discord = require('discord.js');
module.exports = async function(bot, message) {
    if (!message.author.bot) {
        try {
            message.server = await new Guild(message.guild).init();
            message.member.guild = message.server;
            message.member = await new User(message.member).init();
            message.member = await message.member.updateStatistics(message);
            if (message.content.indexOf(message.server.prefix) == 0) {
                const commandName = message.content.slice(message.server.prefix.length).split(' ')[0];
                const command = new Command(commandName);

                if (command.name != undefined) {
                    const args = message.content.slice(message.server.prefix.length).split(' '); args.shift();

                    if (command.perms.bot != undefined && command.perms.guild != undefined) {
                        const execute = function(path) {
                            try {
                                require(`./../commands/${command.command}`).run(bot, message, args);
                            } catch (err) {
                                const error = new BotError(err);
                                const embed = new Discord.RichEmbed()
                                    .setTitle('An internal error occured')
                                    .setDescription(`Please report the following error to the development team of **${bot.user.username}**.\n\`\`\`xl\n${error.string}\`\`\``)
                                    .setColor('RED');
                                message.channel.send({embed});
                            }
                        }
    
                        if (message.member.perms.bot.has('ADMINISTRATOR')) {
                            execute(command.command);
                        } else {
                            var isAllowed = [false, false, false];
                            var missingPerms = [[], [], []];
                            for (let element of Perms.decodePermsIntoArray(command.perms.bot, require('./../data/perms.json'))) {
                                message.member.perms.bot.has(element) ? isAllowed[0] = true : missingPerms[0].push(element);
                            }
                            for (let element of Perms.decodePermsIntoArray(command.perms.guild, require('./../data/guildPerms.json'))) {
                                message.member.perms.guild.has(element) ? isAllowed[1] = true : missingPerms[1].push(element);
                            }
    
                            if (command.perms.discord == null) {
                                isAllowed[2] = true;
                            } else {
                                for (let element of command.perms.discord.split(' ')) {
                                    if (message.member.permissionsIn(message.channel).has(element)) {
                                        isAllowed[2] = true;
                                    } else {
                                        missingPerms[2].push(element);
                                    }
                                }
                            }
    
                            if (isAllowed[0] && isAllowed[1] && isAllowed[2]) {
                                execute(command.command);
                            } else {
                                const stringMissingPerms = `${!isEmpty(missingPerms[0]) ? `**${bot.user.username} Permissions : **` + missingPerms[0].join(' ') + '\n' : ''}${!isEmpty(missingPerms[1]) ? `**Guild Permissions : **` + missingPerms[2].join(' ') + '\n' : ''}${!isEmpty(missingPerms[2]) ? '**Discord Permissions : **' + missingPerms[2].join(' ') : ''}`;
                                const embed = new Discord.RichEmbed()
                                    .setAuthor(message.author.username, message.author.avatarURL)
                                    .setTitle('Missing Permissions')
                                    .setDescription(`This command needs you to have permissions which you do not have, including the following : \n${stringMissingPerms}`)
                                    .setColor('ORANGE');
                                message.channel.send({embed});
                            }
                        }
                    }
                }
            }
        } catch(err) {
            const error = new BotError(err);
            const embed = new Discord.RichEmbed()
                .setTitle('An internal error occured')
                .setDescription(`Please report the following error to the development team of **${bot.user.username}**.\n\`\`\`xl\n${error.string}\`\`\``)
                .setColor('RED');
            message.channel.send({embed});
        }
    }
}