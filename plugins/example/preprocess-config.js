/**
 * Modify configuration
 *
 * @param {object} config Example configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed example configuration
 */
module.exports = function preprocessExampleConfig (config = {}, fullConfig) {
    // Do something with config, eg. add files starting with underscore to the ignore list.
    // Ignore will be a list of globs, relative to the example source path, see task.js
    config.ignore = config.ignore.concat([
        '_*',
        '**/_*'
    ]);

    return config;
}
