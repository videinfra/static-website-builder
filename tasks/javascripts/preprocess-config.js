const paths = require('../../lib/get-path');
const merge = require('../../lib/merge');
const getEnvData = require('../env/get-env');
const get = require('lodash/get');
const cloneDeep = require('lodash/cloneDeep');
const replace = require('@rollup/plugin-replace');
/**
 * Modify configuration
 *
 * @param {object} config Javascript configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed javascript configuration
 */
module.exports = function preprocessJavascriptsConfig (config, fullConfig) {
    let entryList = config.entryList;

    // User may specify a function, execute it to get object / array
    if (typeof entryList === 'function') {
        entryList = entryList(config);
    }

    // User may specify multiple entry list files, convert to array
    if (!Array.isArray(entryList)) {
        entryList = [entryList];
    }

    // User may specify only a name of the entry file
    // Set shared chunk name for each of the entry files
    // Each entryList item is { name: '...', shared?: '...', outpuSubFolder?: '...' }
    entryList = entryList.map((entry, index) => {
        return {
            name: typeof entry === 'string' ? entry : entry.name,
            shared: typeof entry !== 'string' && entry && entry.shared ? entry.shared : (index === 0 ? 'shared' : ''),
            outpuSubFolder: typeof entry !== 'string' && entry && entry.outpuSubFolder ? entry.outpuSubFolder : '',
        };
    });

    return entryList.map((entry) => {
        const entryConfig = cloneDeep(config);
        entryConfig.rolldown = Object.assign({}, entryConfig.rolldown);

        // Output paths
        const output = merge({
        }, get(entryConfig, ['rolldown', 'output'], null));

        output.dir = output.dir
            .replace('[folder]/', entry.outpuSubFolder ? entry.outpuSubFolder + '/' : '')
            .replace('[folder]', entry.outpuSubFolder ? entry.outpuSubFolder : '');

        output.dir = paths.getDestPath('javascripts', output.dir);

        // Use process.env... variables from .env files
        const envVariables = merge(getEnvData().js, {
            'process.env.NODE_ENV': JSON.stringify(global.production ? 'production' : 'development'),
        });

        const buildConfig = merge(entryConfig, {
            rolldown: {
                // Entries, this file is resolved by gulp-rolldown and converted into
                // `inputs` option
                entries: entry,

                plugins: [
                    replace({
                        preventAssignment: true,
                        ...envVariables,
                        // './shared.js': './shared.js?rcujz',
                        // './rolldown-runtime.js': './rolldown-runtime.js?rcujz',
                    }),
                ],

                // Output folder
                output: output,

                // Imports
                resolve: merge({
                    // File extensions
                    extensions: entryConfig.extensions.map((extension) => `.${ extension }`),

                    // Import folders
                    modules: [
                        // Allow imports from node_modules
                        paths.getBuilderPath('node_modules'),
                        paths.getProjectPath('node_modules'),

                        // Allow imports from source folder
                        paths.getSourcePath('javascripts'),
                    ],
                }, get(entryConfig, ['rolldown', 'resolve'], {})),
            }
        });

        return buildConfig;
    });

}
