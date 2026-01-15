exports.sitemap = {
    // Add twig to the extensions
    extensions: ['html'],

    // Glob list of files, which to ignore
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Gulp sitemap specific settings
    sitemap: {
        // Skip noindex pages
        noindex: true,

        // Change frequency
        changefreq: 'daily',

        // Custom priority function
        priority: function(siteUrl, loc, entry) {
            return loc === siteUrl ? 1 : 0.9;
        },
    },

    // Production only settings, overwrites default settings
    production: {},

    // Development only settings, overwrites default settings
    development: {},
};

exports.tasks = {
    sitemap: [
        require('./task'),
    ]
};

exports.preprocess = {
    sitemap: [
        require('./preprocess-config'),
    ]
};

/**
 * Paths relative to the global src and dest folders
 */
exports.paths = {
    sitemap: {
        'dest': '',
    }
};
