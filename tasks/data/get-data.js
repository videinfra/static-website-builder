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

    // Find locale information
    const translationConfig = getTaskConfig('translations');
    const locales = translationConfig.locales;
    const defaultLocale = translationConfig.defaultLocale;

    /**
     * Create symfony request parameter
     * @param {object} values
     * @returns {object}
     */
    function symfonyRequestProperty(values) {
        values = values || {};
        return {
            all: values,
            get: function (name) {
                return name in values ? values[name] : null;
            },
            has: function (name) {
                return !!(name in values);
            },
        };
    }

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

    const getRouteFromPath = function (path) {
        if (!path || path === '/') {
            return 'app.homepage';
        } else {
            return path;
        }
    }

    return function (file) {
        // We expose `currentPagePath` to Twig templates
        const currentPagePath = getCurrentPagePath(file);

        // Resolve locales
        let currentPagePathWithoutLocale = currentPagePath;
        let locale = currentPagePath.split('/')[1];

        if (!locales.includes(locale)) {
            locale = defaultLocale;
        } else {
            currentPagePathWithoutLocale = currentPagePath.replace(`/${locale}`, '') || '/';
        }

        const symonyAppData = {
            app: {
                environment: global.production ? 'prod' : 'dev',
                debug: false,

                request: {
                    content: null,
                    languages: locales,
                    charsets: null,
                    encodings: null,
                    acceptableContentTypes: null,
                    pathInfo: currentPagePath,
                    requestUri: currentPagePath,
                    baseUrl: '',
                    basePath: null,
                    method: 'GET',
                    format: null,
                    locale: locale,
                    defaultLocale: defaultLocale,

                    attributes: symfonyRequestProperty({
                        _locale: locale,
                        _route: getRouteFromPath(currentPagePathWithoutLocale),
                        _route_params: {
                            _locale: locale,
                        },
                    }),
                    query: symfonyRequestProperty(),
                    server: symfonyRequestProperty(),
                    files: symfonyRequestProperty(),
                    cookies: symfonyRequestProperty(),
                    headers: symfonyRequestProperty(),

                    get: function () {
                        return null;
                    },
                }
            }
        };

        if (build) {
            // Cache during full build
            if (!cache) {
                cache = getData();
            }

            return merge({
                currentPagePath,
                ...cache,
            }, symonyAppData);
        } else {
            // Don't cache during watch build
            cache = null;
            return merge({
                currentPagePath,
                ...getData(),
            }, symonyAppData);
        }
    };
}
