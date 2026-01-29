import { getDestPath } from './../../lib/get-path.js';
import globs from './../../lib/globs-helper.js';

/**
 * Modify configuration
 *
 * @param {object} config Clean configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed clean configuration
 */
export default function preprocessCleanConfig(config = {}, fullConfig) {
    if (!config.patterns || !config.patterns.length) {
        config.patterns = globs.paths(getDestPath()).generate();
    } else {
        config.patterns = globs.paths(getDestPath()).paths(config.patterns).generate();
    }

    return config;
}
