import path from 'path';
import reduce from 'lodash/reduce.js';
import micromatch from 'micromatch'; // gulp dependency

import merge from '../../lib/merge.js';
import { getSourcePaths, getPathConfig } from '../../lib/get-path.js';
import { getTaskConfig } from '../../lib/get-config.js';
import logError from '../../lib/log-error.js';
import getFileNamesSync from '../../lib/get-file-names.js';
import camelizeFileName from '../../lib/camelize-file-name.js';
import getEnvData from '../env/get-env.js';

function getData() {
    const folders = getSourcePaths('data');
    const extensions = getTaskConfig('data', 'extensions');
    const loaders = getTaskConfig('data', 'loaders');
    const ignore = getTaskConfig('data', 'ignore');
    const group = getTaskConfig('data', 'groupByFileName');
    const envData = getEnvData();

    // Merge into process.env before loading data because these may be used
    // in data
    merge(process.env, envData.env);

    const data = reduce(
        folders,
        (data, folder) => {
            getFileNamesSync(folder).forEach((fileName) => {
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
                                    data = merge(data, { [name]: fileData });
                                } else {
                                    // Merge together
                                    data = merge(data, fileData);
                                }
                            } catch (err) {
                                logError({
                                    message: `Failed to parse "${path.join(getPathConfig().src, getPathConfig().data.src, fileName)}"`,
                                    plugin: 'data',
                                });
                            }
                        } else {
                            logError({
                                message: `Data loader for files with "${extension}" extension is not defined in configuration data.loaders property`,
                                plugin: 'data',
                            });
                        }
                    }
                }
            });

            return data;
        },
        {},
    );

    // Merge with env variables
    return merge(data, envData.twig);
}

let cache = null;

export default function (options) {
    const build = options && !!options.build;
    const htmlSourceFolders = getSourcePaths('html');

    /**
     * Calculate current page path based on file path which is being processed
     * @param {*} file
     * @returns {string} Current page path
     */
    const getCurrentPagePath = function (file) {
        let currentPagePath = '';

        // Remove extension
        const htmlFilePath = file.path ? file.path.replace(/\..+?$/, '') : '';

        // Remove html source folder from path
        if (htmlFilePath && htmlSourceFolders.length) {
            for (let i = 0; i < htmlSourceFolders.length; i++) {
                const htmlSourceFolder = htmlSourceFolders[i];
                if (htmlFilePath.indexOf(htmlSourceFolder) === 0) {
                    currentPagePath = htmlFilePath
                        .replace(htmlSourceFolder, '')
                        .replace(/[\/\\]index$/, '');

                    // Make sure that the root page is just '/', not empty string
                    currentPagePath = currentPagePath || '/';
                }
            }
        }

        return currentPagePath;
    }

    return function (file) {
        // We expose `currentPagePath` to Twig templates
        const currentPagePath = getCurrentPagePath(file);

        if (build) {
            // Cache during full build
            if (!cache) {
                cache = getData();
            }

            return {
                currentPagePath,
                ...cache
            };
        } else {
            // Don't cache during watch build
            cache = null;
            return {
                currentPagePath,
                ...getData(),
            };
        }
    };
}
