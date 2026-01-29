import * as preprocessBrowserSyncConfig from './preprocess-config.js';
import * as taskBrowserSync from './task.js';

/**
 * Browsersync DEV server settings
 */
export const browserSync = {
    // Production only settings, overwrites default settings
    production: false,

    // Development only settings, overwrites default settings
    // For browserSync options see https://www.browsersync.io/docs/options
    development: {
    },
};

export const preprocess = {
    browserSync: [
        preprocessBrowserSyncConfig,
    ]
};

export const tasks = {
    browserSync: [
        taskBrowserSync,
    ]
};


/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    browserSync: {
        // Server root directory, relative to the project
        // If not set then global dest folder
        'dest': null,
    }
};
