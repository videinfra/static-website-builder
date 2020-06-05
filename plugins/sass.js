/**
 * SASS plugin attaches itself to the stylesheets task
 */
exports.stylesheets = {
    // Add sass to the extensions
    extensions: ['scss', 'sass'],

    // SASS options
    // see https://github.com/sass/node-sass#options
    sass: {
        includePaths: ['./node_modules'],
    },
};

exports.preprocess = {
    stylesheets: [
        require('./sass-engine/preprocess-config'),
    ]
};
