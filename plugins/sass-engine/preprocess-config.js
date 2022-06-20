const paths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');
const getPaths = require('./../../lib/get-path');
const assign = require('lodash/assign');
const gulpSass = require('gulp-sass');


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
        }


        // Engine is a function which returns a gulp pipe function
        config.engine = function getSASSEngine () {
            const sass = config.legacy ? gulpSass(require('node-sass')) : gulpSass(require('sass'));
            return sass(getConfig.getTaskConfig('stylesheets', 'sass')).on('error', sass.logError)
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
