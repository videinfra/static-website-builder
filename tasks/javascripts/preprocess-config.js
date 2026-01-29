import { getDestPath, getBuilderPath, getProjectPath, getSourcePath } from '../../lib/get-path.js';
import merge from '../../lib/merge.js';
import getEnvData, { loadEnvData } from '../env/get-env.js';
import get from 'lodash/get.js';
import cloneDeep from 'lodash/cloneDeep.js';
import replace from '@rollup/plugin-replace';

/**
 * Modify configuration
 *
 * @param {object} config Javascript configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed javascript configuration
 */
export default function preprocessJavascriptsConfig(config, fullConfig) {
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
            shared: typeof entry !== 'string' && entry && entry.shared ? entry.shared : index === 0 ? 'shared' : '',
            outpuSubFolder: typeof entry !== 'string' && entry && entry.outpuSubFolder ? entry.outpuSubFolder : '',
        };
    });

    return entryList.map((entry) => {
        const entryConfig = cloneDeep(config);
        entryConfig.rolldown = Object.assign({}, entryConfig.rolldown);

        // Output paths
        const output = merge({}, get(entryConfig, ['rolldown', 'output'], null));

        output.dir = output.dir.replace('[folder]/', entry.outpuSubFolder ? entry.outpuSubFolder + '/' : '').replace('[folder]', entry.outpuSubFolder ? entry.outpuSubFolder : '');

        output.dir = getDestPath('javascripts', output.dir);

        // Use process.env... variables from .env files
        const envVariables = merge(getEnvData().js, {
            'process.env.NODE_ENV': JSON.stringify(global.production ? 'production' : 'development'),
        });

        // Rewrite shared.js and rolldown-runtime.js to include cache busting asset version so that we could
        // preload those assets using <link rel="preload" as="script" href="{{ asset(...) }}" />
        const envData = loadEnvData();
        const assetVersion = envData['ASSETS_VERSION'];
        const replacements = {};

        if (assetVersion) {
            replacements['/rolldown-runtime.js'] = `/rolldown-runtime.js?v=${assetVersion}`;

            if (entry.shared) {
                replacements[`/${entry.shared}.js`] = `/${entry.shared}.js?v=${assetVersion}`;
            }
        }

        const buildConfig = merge(entryConfig, {
            rolldown: {
                // Entries, this file is resolved by gulp-rolldown and converted into
                // `inputs` option
                entries: entry,

                plugins: [
                    replace({
                        preventAssignment: true,
                        ...envVariables,
                        ...replacements,
                    }),
                ],

                // Output folder
                output: output,

                // Imports
                resolve: merge(
                    {
                        // File extensions
                        extensions: entryConfig.extensions.map((extension) => `.${extension}`),

                        // Import folders
                        modules: [
                            // Allow imports from node_modules
                            getBuilderPath('node_modules'),
                            getProjectPath('node_modules'),

                            // Allow imports from source folder
                            getSourcePath('javascripts'),
                        ],
                    },
                    get(entryConfig, ['rolldown', 'resolve'], {}),
                ),
            },
        });

        return buildConfig;
    });
}
