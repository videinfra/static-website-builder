const paths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');
const getPaths = require('./../../lib/get-path');
const merge = require('./../../lib/merge');
const getEnvData = require('./../../tasks/env/get-env');
const assign = require('lodash/assign');
const gulpSass = require('../../vendor/gulp-sass/index');


/**
 * Modify configuration
 *
 * @param {object} config Stylesheet configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed stylesheet configuration
 */
module.exports = function processSASSConfig (config, fullConfig) {
    if (config && config.sass) {
        if (config.sass.includePaths) {
            // Map include paths to the project folder
            config.sass.includePaths = config.sass.includePaths.map((path) => paths.getProjectPath(path));
        } else {
            config.sass.includePaths = [];
        }

        // Add stylesheet source path
        const stylesheetSourcePath = getPaths.getSourcePaths('stylesheets')

        stylesheetSourcePath.forEach((path) => {
            if (!config.sass.includePaths.includes(path)) {
                config.sass.includePaths.push(path);
            }
        });

        // Engine is a function which returns a gulp pipe function
        config.engine = function getSASSEngine () {
            const sass = gulpSass(require('sass'));
            const sassConfig = getConfig.getTaskConfig('stylesheets', 'sass');

            if (config.legacy) {
                sassConfig.silenceDeprecations = (sassConfig.silenceDeprecations || []).concat(['import', 'global-builtin', 'slash-div', 'color-functions']);
            }

            sassConfig.data = merge(getEnvData().sass, sassConfig.data || {});
            return sass(sassConfig, /* sync */ true).on('error', sass.logError);
        };

        // Main 'dependents' config is shared between all tasks
        if (config.dependents) {

            for (let extension in config.dependents) {
                config.dependents[extension].basePaths = config.dependents[extension].basePaths || [];
                config.dependents[extension].basePaths = config.dependents[extension].basePaths.concat(
                    getPaths.getSourcePaths('stylesheets')
                );
            }

            fullConfig.dependents = assign(fullConfig.dependents || {}, config.dependents);
        }
    }

    return config;
}
