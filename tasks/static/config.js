exports.static = {
    // Glob list of files, which to ignore
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Production only settings, overwrites default settings
    production: {
    },

    // Development only settings, overwrites default settings
    development: {
    },
};

exports.tasks = {
    static: [
        require('./task'),
    ]
};


/**
 * Paths relative to the global src and dest folders
 */
exports.paths = {
    static: {
        'src': 'static',
        'dest': '',
    }
};
