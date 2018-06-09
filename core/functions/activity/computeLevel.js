const XPToLevelUp = function(level) {
    return Math.floor(50 + Math.pow(level * 20, 1.55));
}

module.exports = function(totalXp) {
    var foundLevel = 0;
    var rest = 0;
    var computingLevel = 10000;
    var computingXp = Math.floor(totalXp);
    if (totalXp > 153) {
        do {
            if (computingXp - XPToLevelUp(computingLevel) >= 0) {
                foundLevel = computingLevel;
                rest = (computingXp - XPToLevelUp(computingLevel + 1)) * -1;
            } else {
                computingLevel--;
            }
        } while (foundLevel == 0);
    } else {
        foundLevel = 0;
    }
    return [foundLevel, XPToLevelUp(computingLevel + 1) - XPToLevelUp(computingLevel), rest, XPToLevelUp(computingLevel + 1)];
}