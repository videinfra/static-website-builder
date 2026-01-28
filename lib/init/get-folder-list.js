import path  from 'path';
import fsPromise from 'fs/promises';

export default function getFolderList (folder) {
    return fsPromise.readdir(folder).then((files) => {
        return Promise.all(files.map((file) => {
            return fsPromise.lstat(path.join(folder, file)).then((stats) => {
                return stats.isDirectory() ? file : null;
            });
        })).then((files) => {
            return files.filter((file) => !!file);
        });
    }, (err) => {
        throw err;
    });
}
