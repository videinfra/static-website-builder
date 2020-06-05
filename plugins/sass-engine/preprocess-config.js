const paths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');
const sass = require('gulp-sass');


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
            return sass(getConfig.getTaskConfig('stylesheets', 'sass')).on('error', sass.logError)
        };
    }

    return config;
}
