const fs = require('fs');
const path = require('path');
const reduce = require('lodash/reduce');

const merge = require('../../lib/merge');
const paths = require('../../lib/get-path');
const config = require('../../lib/get-config');
const logError = require('../../lib/log-error');


module.exports = function getData () {
    const folders = paths.getSourcePaths('data');
    const extensions = config.getTaskConfig('data', 'extensions');
    const loaders = config.getTaskConfig('data', 'loaders');

    const data = reduce(folders, (data, folder) => {
        fs.readdirSync(folder).forEach(fileName => {
            // Ignore files starting with underscore
            if (fileName[0] !== '_') {
                const extension = fileName.split('.').pop();

                if (extension && extensions.indexOf(extension) !== -1 && extension in loaders) {
                    try {
                        const fullFilePath = path.resolve(folder, fileName);
                        const fileData = loaders[extension](fullFilePath);
                        data = merge(data, fileData);
                    } catch (err) {
                        logError(err);
                    }
                }
            }
        });

        return data;
    }, {});

    return data;
}
