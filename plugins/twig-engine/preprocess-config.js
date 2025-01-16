const twig = require('../../vendor/gulp-twig/index');
const getConfig = require('./../../lib/get-config');
const getPaths = require('./../../lib/get-path');
const flattenDeep = require('lodash/flattenDeep');
const assign = require('lodash/assign');


/**
 * Modify configuration
 *
 * @param {object} config HTML configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed HTML configuration
 */
module.exports = function preprocessHTMLConfig (config = {}, fullConfig) {
    if (config.twig) {
        config.twig.base = getPaths.getSourcePaths('html');

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
        if (Array.isArray(config.twig.extend)) {
            const extendFnList = config.twig.extend;
            config.twig.extend = function (Twig) {
                extendFnList.forEach((fn) => fn(Twig));
            };
        }

        // Main 'dependents' config is shared between all tasks
        if (config.dependents) {
            for (let extension in config.dependents) {
                config.dependents[extension].basePaths = config.dependents[extension].basePaths || [];
                config.dependents[extension].basePaths = config.dependents[extension].basePaths.concat(
                    config.twig.base
                );
            }

            fullConfig.dependents = assign(fullConfig.dependents || {}, config.dependents);
        }
    } else {
        config.twig = false;
    }

    return config;
}
