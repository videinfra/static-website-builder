const twig = require('gulp-twig');
const getConfig = require('./../../lib/get-config');
const paths = require('./../../lib/get-path');
const flattenDeep = require('lodash/flattenDeep');


/**
 * Modify configuration
 *
 * @param {object} config HTML configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed HTML configuration
 */
module.exports = function preprocessHTMLConfig (config = {}, fullConfig) {
    if (config.twig) {
        config.twig.base = paths.getSourcePaths('html');

        // Engine is a function which returns a gulp pipe function
        config.engine = function getTwigEngine () {
            return twig(getConfig.getTaskConfig('html', 'twig'));
        };

        if (config.twig.functions) {
            config.twig.functions = flattenDeep(config.twig.functions);
        }
        if (config.twig.filters) {
            config.twig.filters = flattenDeep(config.twig.filters);
        }
    } else {
        config.twig = false;
    }

    return config;
}
