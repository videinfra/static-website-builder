const paths = require('../../lib/get-path');
const merge = require('../../lib/merge');
const get = require('lodash/get');
const map = require('lodash/map');
const webpack = require('webpack');
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin');

/**
 * Require file without caching it
 * @param {string} module Module path
 * @returns {any} Module
 */
function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

/**
 * Returns JS entry files
 *
 * @param {object} config Javascript configuration
 * @returns {object} List of entry files
 */
function getEntry (config) {
    const entryFile = paths.getSourcePath('javascripts', config.entryList);

    // console.log(require(entryFile));
    // return () => {
    //     return new Promise((resolve) => {
    //         resolve(require(entryFile));
    //     });
    // };

    // return () => new Promise((resolve) => {
    //     resolve(['./demo', './demo2'])
    // });

    return function getEntries () {
        // const entryURL = pathToFileURL(entryFile).href + '?_invalidate-cache=' + (++entriesCounter);

        // console.log(require.cache.);
        // console.log('loading entries:', entryURL);
        // return import(entryURL).then((entries) => {
        //     console.log('loaded entries:', entries.default);
        //     return entries.default;
        // });

        const entries = requireUncached(entryFile);
        console.log('entries:', entries);
        return entries;
    }
}

/**
 * Modify configuration
 *
 * @param {object} config Javascript configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed javascript configuration
 */
module.exports = function preprocessJavascriptsConfig (config, fullConfig) {
    let webpackPlugins = get(config, ['webpack', 'plugins'], []);

    if (typeof webpackPlugins === 'function') {
        webpackPlugins = webpackPlugins(webpack);
    }

    return merge(config, {
        webpack: {
            mode: global.production ? 'production' : 'development',

            // Input files
            context: paths.getSourcePath('javascripts'),
            entry: getEntry(config),

            // Output folder
            output: merge({
                path: paths.getDestPath('javascripts'),
                publicPath: paths.getPublicPath('javascripts'),
            }, get(config, ['webpack', 'output'], null)),

            // Plugins, add ENV variables
            plugins: [
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(global.production ? 'production' : 'development'),
                }),
                new WatchExternalFilesPlugin.default({
                    verbose: false,
                    files: [
                        paths.getSourcePath('javascripts', config.entryList),
                    ],
                }),
            ].concat(webpackPlugins),

            // Imports
            resolve: merge({
                // File extensions
                extensions: map(config.extensions, (extension) => `.${ extension }`),

                // Import folders
                modules: [
                    // Allow imports from node_modules
                    paths.getProjectPath('node_modules'),

                    // Allow imports from source folder
                    paths.getSourcePath('javascripts'),
                ],
            }, get(config, ['webpack', 'resolve'], null)),

            // Loader imports
            resolveLoader: {
                modules: [
                    // Allow imports from node_modules
                    paths.getBuilderPath('node_modules'),
                    paths.getProjectPath('node_modules'),
                ]
            },
        }
    });
}
