const config = require('./../../config.json');
const mysql = require('mysql');
module.exports = function(query, dbName) {
    const returnPool = function(dbName) {
        return mysql.createPool({
            connectionLimit: 10,
            host: config.mysql[dbName].host == undefined ? 'localhost': config.mysql[dbName].host,
            user: config.mysql[dbName].username,
            password: config.mysql[dbName].password,
            database: dbName
        });
    }

    const pool = returnPool(dbName != undefined ? dbName : 'tranquility');
    return new Promise((resolve, reject) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query(query, function(err, result) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
}