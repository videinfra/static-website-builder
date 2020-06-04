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

    // Group data by filename (without extension + cammelCase)
    // eg, person-names.js -> {'personNames': ...}
    groupByFileName: false,
};
