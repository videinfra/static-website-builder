import * as imageTask from './task.js';

export const images = {
    // Glob list of files, which to ignore, relative to the image source folder
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Production only settings, overwrites default settings
    production: {},

    // Development only settings, overwrites default settings
    development: {},
};

export const tasks = {
    images: [imageTask],
};

/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    images: {
        src: 'images',
        dest: 'assets/images',
    },
};
