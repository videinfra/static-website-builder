const paths = require('../../lib/get-path');
const merge = require('../../lib/merge');
const get = require('lodash/get');
const map = require('lodash/map');
const cloneDeep = require('lodash/cloneDeep');
const webpack = require('webpack');
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin');
const WebpackURLVersioningPlugin = require('./webpack-url-version');

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
    const entryFile = paths.getSourcePath('javascripts', config.entryList.name);

    return function getEntries () {
        return requireUncached(entryFile);
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

    // User may specify a function, execute it to get object / array
    if (typeof config.entryList === 'function') {
        config.entryList = config.entryList(config);
    }

    // User may specify multiple entry list files, convert to array
    if (!Array.isArray(config.entryList)) {
        config.entryList = [config.entryList];
    }

    // User may specify only a name of the entry file
    // Set shared chunk name for each of the entry files
    // Each entryList item is { name: '...', shared: '...' }
    config.entryList = config.entryList.map((entry, index) => {
        return {
            name: typeof entry === 'string' ? entry : entry.name,
            shared: typeof entry !== 'string' && entry && entry.shared ? entry.shared : (index === 0 ? 'shared' : ''),
        };
    });

    return config.entryList.map((entryList) => {
        const entryConfig = Object.assign({}, config);
        entryConfig.webpack = Object.assign({}, entryConfig.webpack);

        // One entry file per config
        entryConfig.entryList = entryList;

        const buildConfig = merge(entryConfig, {
            webpack: {
                mode: global.production ? 'production' : 'development',

                // Input files
                context: paths.getSourcePath('javascripts'),
                entry: getEntry(entryConfig),

                // Output folder
                output: merge({
                    path: paths.getDestPath('javascripts'),
                    publicPath: paths.getPublicPath('javascripts'),
                }, get(entryConfig, ['webpack', 'output'], null)),

                // Plugins, add ENV variables
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': JSON.stringify(global.production ? 'production' : 'development'),
                    }),
                    new WatchExternalFilesPlugin.default({
                        verbose: false,
                        files: [
                            paths.getSourcePath('javascripts', entryList.name),
                        ],
                    }),
                    new WebpackURLVersioningPlugin(),
                ].concat(webpackPlugins),

                // Imports
                resolve: merge({
                    // File extensions
                    extensions: map(entryConfig.extensions, (extension) => `.${ extension }`),

                    // Import folders
                    modules: [
                        // Allow imports from node_modules
                        paths.getProjectPath('node_modules'),

                        // Allow imports from source folder
                        paths.getSourcePath('javascripts'),
                    ],
                }, get(entryConfig, ['webpack', 'resolve'], null)),

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

        // Add webpack.optimization.runtimeChunk and webpack.optimization.splitChunks,
        // if entryConfig.shared doesn't exist, then remove them
        if (entryList.shared && entryList.shared !== 'shared') {
            const optimization = buildConfig.webpack.optimization = cloneDeep(buildConfig.webpack.optimization || {});

            if (get(optimization, ['runtimeChunk', 'name'], null) === 'shared') {
                // Change shared runtimeChunk name
                optimization.runtimeChunk.name = entryList.shared;
            } else if (!optimization.runtimeChunk) {
                // Add shared runtimeChunk
                optimization.runtimeChunk = {
                    name: entryList.shared,
                };
            }

            if ('shared' in get(optimization, ['splitChunks', 'cacheGroups'], {})) {
                // Rename split chunks "shared" chunk
                const cacheGroups = optimization.splitChunks.cacheGroups.shared;
                delete(optimization.splitChunks.cacheGroups.shared);
                optimization.splitChunks.cacheGroups[entryList.shared] = cacheGroups;
                cacheGroups.name = entryList.shared;
            } else if (!optimization.splitChunks) {
                // Add splitChunks
                optimization.splitChunks = optimization.splitChunks || {};
                optimization.splitChunks.cacheGroups = optimization.splitChunks.cacheGroups || {};
                optimization.splitChunks.cacheGroups[entryList.shared] = {
                    name: entryList.shared,
                    chunks: 'all',
                    minChunks: 3,
                    enforce: true,
                };
            }
        } else if (!entryList.shared) {
            // Remove optimization
            delete(buildConfig.webpack.optimization);
        }

        return buildConfig;
    });

}
