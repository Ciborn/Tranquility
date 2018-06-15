const request = require('request');
const apikey = require('./../../../config.json').apikeys.osu;
module.exports = function(url) {
    return new Promise((resolve, reject) => {
        request(`https://osu.ppy.sh/api/${url}&k=${apikey}`, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body), response);
            }
        });
    });
}