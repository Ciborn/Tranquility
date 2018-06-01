const fs = require('fs');
const util = require('util');
module.exports = class Cache {
    constructor(subDir, fileName) {
        this.subDir = subDir == undefined ? null : subDir;
        this.fileName = fileName == undefined ? 'cache.json' : fileName;
        fs.existsSync('cache') ? null : fs.mkdirSync('cache');
        if (this.subDir != null) {
            fs.existsSync(`cache/${this.subDir}`) ? null : fs.mkdirSync(`cache/${this.subDir}`);
        }
    }

    writePath(path, key, value) {
        let data = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path, {encoding: "utf8"})) : {};
        data[key] = value;
        fs.writeFileSync(path, JSON.stringify(data));
    }

    set(key, value) {
        if (this.subDir == null) {
            this.writePath(`cache/${this.fileName}`, key, value);
        } else {
            fs.existsSync(`cache/${this.subDir}`) ? null : fs.mkdirSync(`cache/${this.subDir}`);
            this.writePath(`cache/${this.subDir}/${this.fileName}`, key, value);
        }
    }

    get(key) {
        const path = `cache${this.subDir ? '/' + this.subDir : ''}/${this.fileName}`;
        fs.existsSync(path) ? null : fs.writeFileSync(path, '{}');
        return JSON.parse(fs.readFileSync(path))[key]
    }
}