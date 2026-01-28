import readPackage  from './read-package.js';
import merge  from '../merge.js';
import fsPromise from 'fs/promises';
import isEqual  from 'lodash/isEqual.js';

export default function mergePackage (fileName, content) {
    return readPackage(fileName).then((packageContent) => {
        const newPackage = merge({}, packageContent, content);

        // Write only if file has changed
        if (!isEqual(packageContent, newPackage)) {
            return fsPromise.writeFile(fileName, JSON.stringify(newPackage, null, '  '));
        } else {
            return Promise.resolve();
        }
    });
};
