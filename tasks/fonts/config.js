exports.fonts = {
    // Glob list of files, which to ignore, relative to the font source folder
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Font file extensions
    extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg', 'otf'],
};

exports.tasks = {
    fonts: [
        require('./task'),
    ]
};


/**
 * Paths relative to the global src and dest folders
 */
exports.paths = {
    fonts: {
        'src': 'fonts',
        'dest': 'assets/fonts',
    }
};
