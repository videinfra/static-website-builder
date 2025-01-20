const path = require('path');
const reduce = require('lodash/reduce');
const micromatch = require('micromatch'); // gulp dependency

const merge = require('../../lib/merge');
const getPaths = require('../../lib/get-path');
const getConfig = require('../../lib/get-config');
const logError = require('../../lib/log-error');
const getFileNamesSync = require('../../lib/get-file-names');
const camelizeFileName = require('../../lib/camelize-file-name');
const getEnvData = require('../env/get-env');

function getData () {
    const folders = getPaths.getSourcePaths('data');
    const extensions = getConfig.getTaskConfig('data', 'extensions');
    const loaders = getConfig.getTaskConfig('data', 'loaders');
    const ignore = getConfig.getTaskConfig('data', 'ignore');
    const group = getConfig.getTaskConfig('data', 'groupByFileName');

    const data = reduce(folders, (data, folder) => {
        getFileNamesSync(folder).forEach(fileName => {
            // Ignore files matching 'ignore' list
            if (ignore.length && micromatch.isMatch(fileName, ignore)) {
                return;
            }

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
                                'message': `Failed to parse "${ path.join(getPaths.getPathConfig().src, getPaths.getPathConfig().data.src, fileName) }"`,
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

    // Merge with env variables
    return merge(data, getEnvData().twig);
}


let cache = null;

module.exports = function (options) {
    const build = options && !!options.build;

    return function () {
        if (build) {
            // Cache during full build
            if (!cache) {
                cache = getData();
            }

            return cache;
        } else {
            // Don't cache during watch build
            cache = null;
            return getData();
        }
    }
}
