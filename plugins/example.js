/**
 * Configuration for the example plugin
 */

exports.example = {
    // Glob list of files, which to ignore
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Filename extensions
    extensions: ['example'],
};

// Function which can validate and modify configuration
exports.preprocess = {
    example: [
        require('./example/preprocess-config'),
    ]
};

// Gulp task
exports.tasks = {
    example: [
        require('./example/task'),
    ]
};

/**
 * Paths relative to the global src and dest folders
 */
exports.paths = {
    example: {
        'src': 'example',
        'dest': 'assets/example',
    }
};
