const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');
const logError = require('../lib/log-error');

// function copyFile(from, to, file) {
//     return new Promise((resolve, reject) => {
//         fs.stat(path.join(from, file), (err, stats) => {
//             if (err) {
//                 logError(err)
//                 resolve();
//             } else {
//                 if (stats.isFile()) {
//                     fs.copyFile(path.join(from, file), path.join(to, file), (err) => {
//                         if (err) logError(err);
//                         resolve();
//                     });
//                 } else {
//                     copyFolder(path.join(from, file), path.join(to, file)).then(resolve, reject);
//                 }
//             }
//         });
//     });
// }

// module.exports = function copyFolder(from, to) {
//     return new Promise((resolve, reject) => {
//         fs.mkdir(to, (err) => {
//             if (err) {
//                 logError(err);
//                 resolve();
//             } else {
//                 fs.readdir(from, (err, files) => {
//                     if (err) {
//                         logError(err)
//                         resolve();
//                     } else {
//                         const promises = files.map((file) => copyFile(from, to, file));
//                         Promise.all(promises).then(resolve, reject);
//                     }
//                 });
//             }
//         });
//     });
// }


function copyFile(from, to, file) {
    const fileName = path.join(from, file);

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
