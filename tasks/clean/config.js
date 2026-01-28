import * as preprocessCleanConfig from './preprocess-config.js';
import * as taskClean from './task.js';

export const clean = {
    // Patterns, relative to the destination folder, see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    // patterns: ['assets/**', 'temp-folder']
    patterns: [],
};

export const preprocess = {
    clean: [
        preprocessCleanConfig,
    ]
};

export const tasks = {
    clean: [
        taskClean,
    ]
};
