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
    if (config && config.cssnano) {
        // Autoprefixer ir running separatelly in postcss
        config.cssnano.autoprefixer = false;
    }

    if (config && config.postcss) {
        config.postcss.plugins = config.postcss.plugins || [];

        // Add autoprefixer
        if (config.autoprefixer && !find(config.postcss.plugins, {'postcssPlugin': 'autoprefixer'})) {
            config.postcss.plugins.push(autoprefixer(config.autoprefixer));
        }

        if (config.cssnano) {
            // Add ignore plugin only if there is nano / minification
            config.postcss.plugins.unshift(require('../../vendor/postcss-ignore-plugin/dist/remove').default);
        }

        // // Add CSS nano
        if (config.cssnano && !find(config.postcss.plugins, {'postcssPlugin': 'cssnano'})) {
            config.postcss.plugins.push(cssnano({
                preset: [config.cssnano.preset, config.cssnano]
            }));
        }

        if (config.cssnano) {
            // Add ignore plugin only if there is nano / minification
            config.postcss.plugins.push(require('../../vendor/postcss-ignore-plugin/dist/add').default);
        }
    }

    return config;
}
