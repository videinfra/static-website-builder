exports.icons = {
    // Glob list of files, which to ignore
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Filename extensions
    extensions: ['svg'],

    // SVG store configuration
    // see https://github.com/w0rm/gulp-svgstore
    svgstore: {
    },

    // SVG min configuration
    // see https://github.com/ben-eb/gulp-svgmin#plugins
    svgmin: [
        {
            removeUnknownsAndDefaults: false
        }
    ],

    // Production only settings, overwrites default settings
    production: {
    },

    // Development only settings, overwrites default settings
    development: {
    },
};

exports.preprocess = {
    icons: [
        require('./preprocess-config'),
    ]
};

exports.tasks = {
    icons: [
        require('./task'),
    ]
};
