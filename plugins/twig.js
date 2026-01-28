import * as preprocessTwigConfig from './twig-engine/preprocess-config.js';
// import * as symfonyFunctions from './twig/symfony-functions.js';
// import * as symfonyFilters from './twig/symfony-filters.js';
// import * as lodashFilters from './twig/lodash-filters.js';

/**
 * TWIG plugin attaches itself to the HTML task
 */
export const html = {
    // Add twig to the extensions
    extensions: ['twig'],

    // Glob list of files, which to ignore
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [
        'shared/**/*',
        'partials/**/*',
        'macros/**/*',
        'embeds/**/*',
        'layouts/**/*',
    ],

    // Dependents plugin for faster builds
    dependents: {
        '.twig': {
            parserSteps: [
                /\{%\s+(?:from|extends|include|embed)\s+['"]([^'"]+)/gm,
            ],
            prefixes: [],
            postfixes: [],
            basePaths: []
        }
    },

    twig: {
        // Async rendering
        async: true,

        // Disabled cache by default, it's enabled for production build only
        cache: false,

        // Rethrow TWIG error so that process exists
        rethrow: true,

        // Custom functions
        functions: [
            // symfonyFunctions,
        ],

        // Custom filters
        filters: [
            // lodashFilters,
            // symfonyFilters,
        ],

        // Production only settings, overwrites default settings
        production: {
            // Enable cache for improved performance during production build
            cache: true,
        },
    },

    // List of CDNs when using symphony filters / funtions
    cdns: [],

    // Add file version number when using symphony filters / funtions
    version: false,
};

export const preprocess = {
    html: [
        preprocessTwigConfig,
    ]
};
