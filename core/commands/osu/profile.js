const api = require('./../../api/osu/osu');
const numeral = require('numeral');
const Discord = require('discord.js');
module.exports = async function(bot, message, args) {
    const loading = await message.channel.send(`Retrieving data from **osu!api**, please wait...`);
    api(`get_user?m=0&u=${args[1]}`).then(data => {
        const embed = new Discord.RichEmbed()
            .setAuthor(`[${data[0].country}] #${numeral(data[0].pp_rank).format('0,0')} | Lv${Math.floor(data[0].level)} - ${data[0].username}`)
            .setTitle(`osu! Statistics for Standard mode`)
            .addField('Accuracy', `${Math.round(100 * data[0].accuracy)/100}%`, true)
            .addField('Play Count', numeral(data[0].playcount).format('0,0'), true)
            .addField('Ranked Informations', `**Country Ranking** : #${numeral(data[0].pp_country_rank).format('0,0')}\n**Score** : ${numeral(data[0].ranked_score).format('0,0')}\n**PPs** : ${data[0].pp_raw}`, true)
            .addField('Count Ranks', `**SS+ / SS** : ${numeral(parseInt(data[0].count_rank_ssh)+parseInt(data[0].count_rank_ss)).format('0,0')}\n**S+ / S** : ${numeral(parseInt(data[0].count_rank_sh)+parseInt(data[0].count_rank_s)).format('0,0')}\n**A** : ${numeral(data[0].count_rank_a).format('0,0')}`, true)
            .setThumbnail(`https://a.ppy.sh/${data[0].user_id}`)
            .setColor(`#dc98a4`);
        loading.delete();
        message.channel.send({embed});
    }).catch(err => {
        loading.edit(`Sorry **${message.author.username}**, but an error occured when retrieving data from **osu!api**. Make sure the requested user exists, otherwise, it may be an error with the API.`);
    });
}