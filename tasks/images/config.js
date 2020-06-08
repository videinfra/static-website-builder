exports.images = {
    // Glob list of files, which to ignore, relative to the image source folder
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
    images: [
        require('./task'),
    ]
};


/**
 * Paths relative to the global src and dest folders
 */
exports.paths = {
    images: {
        'src': 'images',
        'dest': 'assets/images',
    }
};
