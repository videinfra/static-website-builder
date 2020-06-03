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
    config.twig = config.twig ||{};
    config.twig.base = paths.getSourcePaths('html');

    if (config.twig.functions) {
        config.twig.functions = flattenDeep(config.twig.functions);
    }
    if (config.twig.filters) {
        config.twig.filters = flattenDeep(config.twig.filters);
    }

    return config;
}
