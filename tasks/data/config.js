/**
 * Data loading for HTML task
 * This task doesn't have actual task, instead it's used by 'html' task
 */

exports.data = {
    extensions: [
        'js',
        'json'
    ],

    // Data loaders for extensions, allows to add custom loaders
    loaders: {
        js: require('./data-loader-js'),
        json: require('./data-loader-json'),
    },

    // Glob list of files, which to ignore, relative to the data source folder
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [
    ],

    // Group data by filename (without extension + cammelCase)
    // eg, person-names.js -> {'personNames': ...}
    groupByFileName: false,
};


/**
 * Paths relative to the global src and dest folders
 */
exports.paths = {
    data: {
        'src': 'html/data',
    }
};
