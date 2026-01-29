/**
 * Configuration for the example plugin
 */
import * as examplePreprocessConfig from './example/preprocess-config.js';
import * as exampleTask from './example/task.js';

export const example = {
    // Glob list of files, which to ignore
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Filename extensions
    extensions: ['example'],
};

// Function which can validate and modify configuration
export const preprocess = {
    example: [
        examplePreprocessConfig,
    ]
};

// Gulp task
export const tasks = {
    example: [
        exampleTask,
    ]
};

/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    example: {
        'src': 'example',
        'dest': 'assets/example',
    }
};
