const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;
const logError = require('../log-error');


function copyFile(from, to, file) {
    const fileName = path.join(from, file);

    if (file !== 'package.json') {
        return fsPromise.lstat(fileName).then((stats) => {
            if (stats.isFile()) {
                return fsPromise
                    .copyFile(fileName, path.join(to, file))
                    .catch((err) => {
                        // logError(err);
                        throw err;
                    });
            } else {
                return copyFolder(fileName, path.join(to, file));
            }
        }, (err) => {
            // logError(err);
            throw err;
        });
    } else {
        return Promise.resolve();
    }
}

function copyFolderContents(from, to) {
    return fsPromise.readdir(from).then((files) => {
        return Promise.all(files.map((file) => copyFile(from, to, file)));
    }, (err) => {
        // logError(err);
        throw err;
    });
}

function copyFolder(from, to) {
    if (fs.existsSync(to)) {
        return copyFolderContents(from, to);
    } else {
        return fsPromise.mkdir(to).then(() => {
            return copyFolderContents(from, to);
        }, (err) => {
            // logError(err);
            throw err;
        });
    }
}


module.exports = copyFolder;
