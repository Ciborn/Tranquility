const DatabasePool = require('./DatabasePool');
const Guild = require('./Discord/Guild');
const { Client } = require('discord.js');
module.exports = class Bot extends Client {
    constructor() {
        super();
        this.cache = {};
        this.dbPool = new DatabasePool();
    }
}