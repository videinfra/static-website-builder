const fs = require('fs');
const path = require('path');

/**
 * Returns list of filenames in folder recursively
 *
 * @param {string} folder Folder path
 * @param {string} [subFolder=''] Subfolder path
 * @returns {array} List of filenames, relative to folder
 */
module.exports = function getFileNamesSync (folder, subFolder = '') {
    let fileNames = []

    fs.readdirSync(folder, { withFileTypes: true }).forEach(file => {
        if (file.isDirectory()) {
            fileNames = fileNames.concat(getFileNamesSync(path.join(folder, file.name), path.join(subFolder, file.name)));
        } else {
            fileNames.push(path.join(subFolder, file.name))
        }
    });

    return fileNames;
}
