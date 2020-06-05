/**
 * Modify configuration
 *
 * @param {object} config HTML configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed HTML configuration
 */
module.exports = function preprocessHTMLConfig (config = {}, fullConfig) {
    // Do something with config
    config.someVariable++;

    return config;
}
