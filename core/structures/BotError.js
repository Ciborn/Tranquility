module.exports = class BotError {
    constructor(err) {
        var modifiedErr = require('util').inspect(err, false, null).split('\n');
        for (let i = 0; i <= 1; i++) {
            modifiedErr.pop();
        }
        this.string = modifiedErr.join('\n');
    }
}