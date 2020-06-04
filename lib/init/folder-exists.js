const fs = require('fs');

module.exports = function folderExists (folder) {
    try {
        const stat = fs.lstatSync(folder);
        return stat.isDirectory();
    } catch (err) {
        return false;
    }
}
