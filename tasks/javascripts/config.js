import * as preprocessJavascriptsConfig from './preprocess-config.js';
import * as javascriptsTask from './task.js';

export const javascripts = {
    // JS file extensions
    extensions: ['js', 'ts', 'tsx', 'jsx', 'json'],

    // Instead of 'entry' we provide filename which list all entries
    // Can be either an object or array of object to have multiple rolldown
    // builds, one for each of the entry list files
    entryList: {
        // Path to the entry list file
        name: '_entries.js',

        // Entry shared chunk name, creates a share chunk if needed
        shared: 'shared',
    },

    rolldown: {
        // Sets the target environment for the generated JavaScript
        // transform: '...',

        // Input files, set from entries in preprocess-config.js
        // input: {},

        output: {
            // format: 'esm',
            dir: './[folder]',
        },
    },

    // Production only settings, overwrites default settings
    production: {
        rolldown: {
            output: {
                sourcemap: 'hidden',
                minify: true,
            },
        },
    },

    // Development only settings, overwrites default settings
    development: {
        rolldown: {
            output: {
                sourcemap: true,
                minify: 'dce-only',
            },
        },
    },
};

export const preprocess = {
    javascripts: [preprocessJavascriptsConfig],
};

export const tasks = {
    javascripts: [javascriptsTask],
};

/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    javascripts: {
        src: 'javascripts',
        dest: 'assets/javascripts',
    },
};
