exports.html = {
    // Engine is a function which returns a gulp pipe function, eg. sass()
    // Intended to be used by plugins, not manually
    engine: null,

    // Filename extensions
    extensions: ['html'],

    // Glob list of files, which to ignore
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [
        'shared/**/*',
        'partials/**/*'
    ],

    // Production only settings, overwrites default settings
    production: {
        // Enable HTML minification
        htmlmin: {}
    },

    // Development only settings, overwrites default settings
    development: {
        // Disable HTML minification
        htmlmin: false
    },
};

exports.tasks = {
    html: [
        require('./task'),
    ]
};
