import * as fontTask from './task.js';

export const fonts = {
    // Glob list of files, which to ignore, relative to the font source folder
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Font file extensions
    extensions: ['woff2', 'woff', 'eot', 'ttf', 'svg', 'otf'],
};

export const tasks = {
    fonts: [fontTask],
};

/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    fonts: {
        src: 'fonts',
        dest: 'assets/fonts',
    },
};
