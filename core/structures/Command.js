module.exports = class Command {
    constructor(commandName) {
        try {
            for (let [key, value] of Object.entries(require(`./../commands/${commandName}`).infos)) {
                this[key] = value;
            }
            this.command = commandName;
        } catch(err) {
            throw new RangeError('Unknown Command');
        }
    }
}