const paths = require('./../../lib/get-path');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const find = require('lodash/find');


/**
 * Modify configuration
 *
 * @param {object} config Stylesheet configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed stylesheet configuration
 */
module.exports = function processStylesheetsConfig (config, fullConfig) {
    if (config && config.sass) {
        if (config.sass.includePaths) {
            // Map include paths to the project folder
            config.sass.includePaths = config.sass.includePaths.map((path) => paths.getProjectPath(path));
        }
    }

    if (config && config.cssnano) {
        // Autoprefixer ir running separatelly in postcss
        config.cssnano.autoprefixer = false;
    }

    if (config && config.postcss) {
        config.postcss.plugins = config.postcss.plugins || {};

        // Add autoprefixer
        if (config.autoprefixer && !find(config.postcss.plugins, {'postcssPlugin': 'autoprefixer'})) {
            config.postcss.plugins.push(autoprefixer(config.autoprefixer));
        }

        // Add CSS nano
        if (config.cssnano && !find(config.postcss.plugins, {'postcssPlugin': 'cssnano'})) {
            config.postcss.plugins.push(cssnano(config.autoprefixer));
        }
    }

    return config;
}
