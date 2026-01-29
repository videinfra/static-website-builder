import fsPromise from 'fs/promises';

export default function mergePackage (fileName, defaultValue = null) {
    return fsPromise.readFile(fileName, {'encoding': 'utf8'}).then((data) => {
        try {
            return JSON.parse(data);
        } catch (err) {
            return Promise.reject(err);
        }
    }).catch((err) => {
        if (defaultValue) {
            return Promise.resolve(defaultValue);
        } else {
            return Promise.reject(err);
        }
    });
};
