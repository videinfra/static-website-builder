exports.fonts = {
    // Glob list of files, which to ignore
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
