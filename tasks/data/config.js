import dataLoaderJs from './data-loader-js.js';
import dataLoaderJson from './data-loader-json.js';

/**
 * Data loading for HTML task
 * This task doesn't have actual task, instead it's used by 'html' task
 */

export const data = {
    extensions: ['js', 'json'],

    // Data loaders for extensions, allows to add custom loaders
    loaders: {
        js: dataLoaderJs,
        json: dataLoaderJson,
    },

    // Glob list of files, which to ignore, relative to the data source folder
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // Group data by filename (without extension + cammelCase)
    // eg, person-names.js -> {'personNames': ...}
    groupByFileName: false,
};

/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    data: {
        src: 'html/data',
    },
};
