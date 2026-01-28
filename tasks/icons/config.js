import * as preprocessIconConfig from './preprocess-config.js';
import * as iconTask from './task.js';

export const icons = {
    // Glob list of files, which to ignore, relative to the icon source folder
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Filename extensions
    extensions: ['svg'],

    // SVG store configuration
    // see https://github.com/w0rm/gulp-svgstore
    svgstore: {},

    // SVG min configuration
    // see https://github.com/ben-eb/gulp-svgmin#plugins
    svgmin: [
        {
            removeUnknownsAndDefaults: false,
        },
    ],

    // Production only settings, overwrites default settings
    production: {},

    // Development only settings, overwrites default settings
    development: {},
};

export const preprocess = {
    icons: [preprocessIconConfig],
};

export const tasks = {
    icons: [iconTask],
};

/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    icons: {
        src: 'icons',
        dest: 'assets/images',
    },
};
