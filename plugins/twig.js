// 'twig' config will be merged into 'html'
exports.html = {
    // Add twig filename to the extensions
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
};

exports.preprocess = {
    html: [
        require('./twig-engine/preprocess-config'),
    ]
};
