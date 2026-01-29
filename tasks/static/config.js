import * as staticFilesTask from './task.js';

export const staticFiles = {
    // Glob list of files, which to ignore, relative to the static source path
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Production only settings, overwrites default settings
    production: {},

    // Development only settings, overwrites default settings
    development: {},
};

export const tasks = {
    staticFiles: [staticFilesTask],
};

/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    staticFiles: {
        src: 'static',
        dest: '',
    },
};
