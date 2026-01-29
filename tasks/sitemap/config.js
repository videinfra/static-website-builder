import * as sitemapTask from './task.js';
import * as preprocessSitemapConfig from './preprocess-config.js';

export const sitemap = {
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
        priority: function (siteUrl, loc, entry) {
            return loc === siteUrl ? 1 : 0.9;
        },
    },

    // Production only settings, overwrites default settings
    production: {},

    // Development only settings, overwrites default settings
    development: {},
};

export const tasks = {
    sitemap: [sitemapTask],
};

export const preprocess = {
    sitemap: [preprocessSitemapConfig],
};

/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    sitemap: {
        dest: '',
    },
};
