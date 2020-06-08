/**
 * TWIG plugin attaches itself to the HTML task
 */
exports.html = {
    // Add twig to the extensions
    extensions: ['twig'],

    // Glob list of files, which to ignore
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [
        'macros/**/*',
        'layouts/**/*',
    ],

    // Dependents plugin for faster builds
    dependents: {
        '.twig': {
            parserSteps: [
                /\{%\s+(?:from|extends|include)\s+['"]([^'"]+)/gm,
            ],
            prefixes: [],
            postfixes: [],
            basePaths: []
        }
    },

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
};

exports.preprocess = {
    html: [
        require('./twig-engine/preprocess-config'),
    ]
};
