/**
 * Modify configuration
 *
 * @param {object} config HTML configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed HTML configuration
 */
module.exports = function preprocessHTMLConfig (config = {}, fullConfig) {
    // Do something with config, eg. add files starting with underscore to the ignore list.
    // Ignore is a list of globs, relative to the example source path
    config.ignore = config.ignore.concat([
        '_*',
        '**/_*'
    ]);

    return config;
}
