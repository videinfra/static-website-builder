const map = require('lodash/map');
const getPaths = require('./../../lib/get-path');
const globs = require('./../../lib/globs-helper');
const isPlainObject = require('lodash/isPlainObject');

/**
 * Modify configuration
 *
 * @param {object} config BrowserSync configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed browserSync configuration
 */
module.exports = function preprocessBrowserSyncConfig (config = {}, fullConfig) {
    // If server is disabled then disable whole browserSync
    // If HTML is not being rendered, then browserSync has no use
    if (config.server === false || fullConfig.html === false) return false;

    if (!isPlainObject(config.server)) {
        config.server = {};
    }

    // Set basedir to output folder by default
    if (config.server) {
        if (config.server.baseDir) {
            // Relative to the project
            config.server.baseDir = getPaths.getProjectPath(config.server.baseDir);
        } else {
            // Set to output folder from path-config.js
            config.server.baseDir = getPaths.getDestPath('browserSync')
        }
    }

    // Set additional files to watch, convert file paths to globs
    if (config.files) {
        config.files = globs.paths(getPaths.getProjectPath()).paths(config.files).generate();
    }

    return config;
}
