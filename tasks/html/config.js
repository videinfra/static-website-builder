import * as htmlTask from './task.js';

export const html = {
    // Engine is a function which returns a gulp pipe function, eg. sass()
    // Intended to be used by plugins, not manually
    engine: null,

    // Filename extensions
    extensions: ['html'],

    // Glob list of files, which to ignore, relative to the html source folder
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Production only settings, overwrites default settings
    production: {
        // Enable HTML minification
        htmlmin: {
            collapseWhitespace: true,
        },
    },

    // Development only settings, overwrites default settings
    development: {
        // Disable HTML minification
        htmlmin: false,
    },
};

export const tasks = {
    html: [htmlTask],
};

/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    html: {
        src: 'html',
        dest: '',
    },
};
