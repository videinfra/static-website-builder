import { getProjectPath, getDestPath }  from './../../lib/get-path.js';
import isPlainObject  from 'lodash/isPlainObject.js';

/**
 * Modify configuration
 *
 * @param {object} config BrowserSync configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed browserSync configuration
 */
export default function preprocessBrowserSyncConfig (config = {}, fullConfig) {
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
            config.server.baseDir = getProjectPath(config.server.baseDir);
        } else {
            // Set to output folder from path-config.js
            config.server.baseDir = getDestPath('browserSync')
        }
    }

    return config;
}
