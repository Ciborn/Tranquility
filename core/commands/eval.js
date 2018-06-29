exports.run = function(bot, message, args) {
    try {
        const code = args.join(' ');
        let evaled = eval(code);
        
        if (typeof evaled !== "string") {
            evaled = require("util").inspect(evaled);
        }
        
        message.channel.send(evaled, {code:"xl"}).catch(err => {
            require('fs').writeFileSync(`./cache/files/${message.id}.txt`, evaled);
            message.channel.send(`The result was too long to be sent on Discord. Everything is in the attachment.`, {
                files: [`./cache/files/${message.id}.txt`]
            });
        });
    } catch (err) {
        message.channel.send(`An error occured.\n\`\`\`xl\n${require('util').inspect(err, false, null)}\n\`\`\``);
    }
}

exports.infos = {
    name: "Code Evaluation",
    perms: {
        bot: 64,
        guild: 1,
        discord: null
    },
    enabled: null,
    category: "Admin",
    description: "Evaluates node.js code"
}