exports.clean = {
    // Patterns, relative to the destination folder, see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    // patterns: ['assets/**', 'temp-folder']
    patterns: [],
};

exports.preprocess = {
    clean: [
        require('./preprocess-config'),
    ]
};

exports.tasks = {
    clean: [
        require('./task'),
    ]
};
