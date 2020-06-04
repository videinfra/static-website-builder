exports.html = {
    // Filename extensions
    extensions: ['twig'],

    // Folder which to exclude from rendering
    excludeFolders: ['macros', 'layouts', 'shared', 'partials'],

    twig: {
        // Custom functions
        functions: [
            // require('../../plugins/twig/symfony-functions.js'),
        ],

        // Custom filters
        filters: [
            // require('../../plugins/twig/lodash-filters.js'),
            // require('../../plugins/twig/symfony-functions.js'),
        ]
    },

    // List of CDNs when using symphony filters / funtions
    cdns: [],

    // Add file version number when using symphony filters / funtions
    version: false,


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

exports.preprocess = {
    html: [
        require('./preprocess-config'),
    ]
};

exports.tasks = {
    html: [
        require('./task'),
    ]
};
