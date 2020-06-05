/**
 * Browsersync DEV server settings
 */
exports.browserSync = {
    // Production only settings, overwrites default settings
    production: false,

    // Development only settings, overwrites default settings
    // For browserSync options see https://www.browsersync.io/docs/options
    development: {
    },
};

exports.preprocess = {
    browserSync: [
        require('./preprocess-config'),
    ]
};

exports.tasks = {
    browserSync: [
        require('./task'),
    ]
};


/**
 * Paths relative to the global src and dest folders
 */
exports.paths = {
    browserSync: {
        // Server root directory, relative to the project
        // If not set then global dest folder
        'dest': null,
    }
};
