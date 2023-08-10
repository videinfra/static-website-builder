const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const postcssNestedCalc = require('@csstools/postcss-nested-calc');
const find = require('lodash/find');

/**
 * Modify configuration
 *
 * @param {object} config Stylesheet configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed stylesheet configuration
 */
module.exports = function processStylesheetsConfig (config, fullConfig) {
    if (config && config.cssnano) {
        // Autoprefixer ir running separatelly in postcss
        config.cssnano.autoprefixer = false;
    }

    if (config && config.postcss) {
        config.postcss.plugins = config.postcss.plugins || [];

        // Add nestedCalc
        if (config.nestedCalc) {
            config.postcss.plugins.push(postcssNestedCalc(config.nestedCalc));
        }

        // Add autoprefixer
        if (config.autoprefixer && !find(config.postcss.plugins, {'postcssPlugin': 'autoprefixer'})) {
            config.postcss.plugins.push(autoprefixer(config.autoprefixer));
        }

        // // Add CSS nano
        if (config.cssnano && !find(config.postcss.plugins, {'postcssPlugin': 'cssnano'})) {
            config.postcss.plugins.push(cssnano({
                preset: [config.cssnano.preset, config.cssnano]
            }));
        }
    }

    return config;
}
