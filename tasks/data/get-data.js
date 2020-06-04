const fs = require('fs');
const path = require('path');
const reduce = require('lodash/reduce');

const merge = require('../../lib/merge');
const paths = require('../../lib/get-path');
const config = require('../../lib/get-config');
const logError = require('../../lib/log-error');

/**
 * Camelize filename
 *
 * @param {string} str File name
 * @returns {string} Camelized name
 */
function camelizeFileName (str) {
    return str
         // Remove extension
        .replace(/\.[^.]+$/ig, '')
        // Replace non alpha-numeric characters
        .replace(/[^a-z0-9]/ig, ' ')
        // Uppercase words
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
             return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        // Remove empty spaces
        .replace(/\s+/g, '');
}

module.exports = function getData () {
    const folders = paths.getSourcePaths('data');
    const extensions = config.getTaskConfig('data', 'extensions');
    const loaders = config.getTaskConfig('data', 'loaders');
    const group = config.getTaskConfig('data', 'groupByFileName');

    const data = reduce(folders, (data, folder) => {
        fs.readdirSync(folder).forEach(fileName => {
            // Ignore files starting with underscore
            if (fileName[0] !== '_') {
                const extension = fileName.split('.').pop();


                if (extension && extensions.indexOf(extension) !== -1) {
                    if (extension in loaders) {
                        try {
                            const fullFilePath = path.resolve(folder, fileName);
                            const fileData = loaders[extension](fullFilePath);

                            if (group) {
                                // Group data
                                const name = camelizeFileName(fileName);
                                data = merge(data, {[name]: fileData});
                            } else {
                                // Merge together
                                data = merge(data, fileData);
                            }
                        } catch (err) {
                            logError({
                                'message': `Failed to parse "${ path.join(paths.getConfig().src, paths.getConfig().data.src, fileName) }"`,
                                'plugin': 'data'
                            });
                        }
                    } else {
                        logError({
                            'message': `Data loader for files with "${ extension }" extension is not defined in configuration data.loaders property`,
                            'plugin': 'data'
                        });
                    }
                }
            }
        });

        return data;
    }, {});

    return data;
}
