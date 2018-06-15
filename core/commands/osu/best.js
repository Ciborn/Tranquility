const api = require('./../../api/osu/osu');
const mods = require('./../../api/osu/mods');
const numeral = require('numeral');
const Discord = require('discord.js');
module.exports = async function(bot, message, args) {
    const loading = await message.channel.send(`Retrieving data from **osu!api**, please wait...`)
    api(`get_user_best?u=${args[1]}&limit=5`).then(async function(data) {
        var records = '';
        for (let value of Object.values(data)) {
            let beatmap = await api(`get_beatmaps?limit=1&b=${value.beatmap_id}`);
            enabledMods = mods(value.enabled_mods).join(' ');
            enabledMods = enabledMods == '' ? 'No Mods' : enabledMods;
            records += `\`[${value.rank}]\` ${beatmap[0].title} [${Math.round(10 * beatmap[0].difficultyrating)/10} Stars] - ${numeral(value.score).format('0,0')} - **x${value.maxcombo} (${Math.round(10 * value.pp)/10}pp)** - ${enabledMods}\n`;
        }

        const embed = new Discord.RichEmbed()
            .setTitle(`Best Plays of ${args[1]}`)
            .setDescription(records);
        loading.delete();
        message.channel.send({embed});
    }).catch(err => {

    })
}