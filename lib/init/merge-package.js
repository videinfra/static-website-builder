const readPackage = require('./read-package');
const fsPromise = require('fs').promises;
const merge = require('../merge');
const isEqual = require('lodash/isEqual');

module.exports = function mergePackage (fileName, content) {
    return readPackage(fileName).then((package) => {
        const newPackage = merge({}, package, content);

        // Write only if file has changed
        if (!isEqual(package, newPackage)) {
            return fsPromise.writeFile(fileName, JSON.stringify(newPackage, null, '  '));
        } else {
            return Promise.resolve();
        }
    });
};
