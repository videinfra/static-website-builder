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
    html: [
        require('./twig-engine/preprocess-config'),
    ]
};
