const poolQuery = require('./../functions/database/poolQuery');
const Guild = require('./Discord/Guild');
const User = require('./Discord/User');
const Discord = require('discord.js');
module.exports = class Bot extends Discord.Client {
    constructor() {
        super();
        this.cache = {};
    }

    async fetchGuild(guildId) {
        if (this.cache.guilds == undefined) this.cache.guilds = {};
        if (this.cache.guilds[guildId] == undefined) {
            this.cache.guilds[guildId] = new Guild(this.guilds.get(guildId));
            await this.cache.guilds[guildId].init();
        }
        return this.cache.guilds[guildId];
    }
}