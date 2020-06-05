const path = require('path');
const fs = require('fs');
const fsPromise = require('fs').promises;


function copyFile(from, to, file) {
    const fileName = path.join(from, file);

    if (file !== 'package.json') {
        return fsPromise.lstat(fileName).then((stats) => {
            if (stats.isFile()) {
                return fsPromise
                    .copyFile(fileName, path.join(to, file))
                    .catch((err) => {
                        throw err;
                    });
            } else {
                return copyFolder(fileName, path.join(to, file));
            }
        }, (err) => {
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
        throw err;
    });
}

function copyFolder(from, to) {
    try {
        fs.accessSync(to);
        return copyFolderContents(from, to);
    } catch (err) {
        return fsPromise.mkdir(to).then(() => {
            return copyFolderContents(from, to);
        }, (err) => {
            throw err;
        });
    }
}


module.exports = copyFolder;
