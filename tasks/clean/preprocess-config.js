const map = require('lodash/map');
const paths = require('./../../lib/get-path');

/**
 * Modify configuration
 *
 * @param {object} config Clean configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed clean configuration
 */
module.exports = function preprocessCleanConfig (config = {}, fullConfig) {
    if (!config.patterns || !config.patterns.length) {
        config.patterns = [
            paths.normalizeGlob(paths.getDestPath())
        ];
    } else {
        config.patterns = map(config.patterns, (pattern) => {
            return paths.normalizeGlob(paths.getProjectPath(paths.getConfig().dest, pattern))
        });
    }

    return config;
}
