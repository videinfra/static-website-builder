import { getSourcePaths, getProjectPath } from './../../lib/get-path.js';
import { getTaskConfig } from './../../lib/get-config.js';
import merge from './../../lib/merge.js';
import getEnvData from './../../tasks/env/get-env.js';
import gulpSass from '../../vendor/gulp-sass/index.js';
import assign from 'lodash/assign.js';
import * as sass from 'sass';

/**
 * Modify configuration
 *
 * @param {object} config Stylesheet configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed stylesheet configuration
 */
export default function processSASSConfig(config, fullConfig) {
    if (config && config.sass) {
        if (config.sass.includePaths) {
            // Map include paths to the project folder
            config.sass.includePaths = config.sass.includePaths.map((path) => getProjectPath(path));
        } else {
            config.sass.includePaths = [];
        }

        // Add stylesheet source path
        const stylesheetSourcePath = getSourcePaths('stylesheets');

        stylesheetSourcePath.forEach((path) => {
            if (!config.sass.includePaths.includes(path)) {
                config.sass.includePaths.push(path);
            }
        });

        // Engine is a function which returns a gulp pipe function
        config.engine = function getSASSEngine() {
            const sassEngine = gulpSass(sass);
            const sassConfig = getTaskConfig('stylesheets', 'sass');

            if (config.legacy) {
                sassConfig.silenceDeprecations = (sassConfig.silenceDeprecations || []).concat(['import', 'global-builtin', 'slash-div', 'color-functions']);
            }

            sassConfig.data = merge(getEnvData().sass, sassConfig.data || {});
            return sassEngine(sassConfig, /* sync */ true).on('error', sassEngine.logError);
        };

        // Main 'dependents' config is shared between all tasks
        if (config.dependents) {
            for (let extension in config.dependents) {
                config.dependents[extension].basePaths = config.dependents[extension].basePaths || [];
                config.dependents[extension].basePaths = config.dependents[extension].basePaths.concat(getSourcePaths('stylesheets'));
            }

            fullConfig.dependents = assign(fullConfig.dependents || {}, config.dependents);
        }
    }

    return config;
}
