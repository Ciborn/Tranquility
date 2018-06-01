module.exports = class BotPerms {
    constructor(bitfield, permissionsFile) {
        this.permissionsFile = permissionsFile == undefined ? require('./../../data/perms.json') : permissionsFile;
        this.setBitfield(bitfield);
    }

    has(perm) {
        if (this.perms.indexOf('ADMINISTRATOR') != -1) {
            return true;
        } else {
            return this.perms.indexOf(perm) != -1 ? true : false;
        }
    }
    
    add(perm) {
        const supportedPerms = Object.keys(this.permissionsFile);
        if (supportedPerms.indexOf(perm) != -1) {
            return this.perms.indexOf(perm) != -1 ? new TypeError('Perm already exists') : this.bitfield + permissions[perm];
        }
    }

    remove(perm) {
        const supportedPerms = Object.keys(permissions);
        if (supportedPerms.indexOf(perm) != -1) {
            return this.perms.indexOf(perm) != -1 ? this.bitfield - this.permissionsFile[perm] : new TypeError('Perm does not exist yet');
        }
    }

    setBitfield(bitfield) {
        this.bitfield = bitfield;
        this.perms = BotPerms.decodePermsIntoArray(this.bitfield, this.permissionsFile);
    }

    static decodePermsIntoArray(bitfield, permissionsFile) {
        var computing = bitfield;
        var permsArray = [];

        var maxBitfield = 0;
        Object.keys(permissionsFile).forEach(element => {
            maxBitfield += permissionsFile[element];
        })

        if (bitfield <= maxBitfield) {
            while (computing > 0) {
                Object.keys(permissionsFile).forEach(element => {
                    if (computing >= permissionsFile[element]) {
                        permsArray.push(element);
                        computing -= permissionsFile[element];
                    }
                })
            }
            
            return permsArray;
        } else {
            return new RangeError(`Bitfield given is above the max allowed`);
        }
    }
}