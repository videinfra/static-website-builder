const getPaths = require('./../../lib/get-path');
const globs = require('./../../lib/globs-helper');

/**
 * Modify configuration
 *
 * @param {object} config Clean configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed clean configuration
 */
module.exports = function preprocessCleanConfig (config = {}, fullConfig) {
    if (!config.patterns || !config.patterns.length) {
        config.patterns = globs.paths(getPaths.getDestPath()).generate();
    } else {
        config.patterns = globs.paths(getPaths.getDestPath()).paths(config.patterns).generate();
    }

    return config;
}
