exports.stylesheets = {
    // File extensions
    extensions: ['scss', 'sass'],

    // SASS options
    // see https://github.com/sass/node-sass#options
    sass: {
        includePaths: ['./node_modules'],
    },

    // Auto prefixer options
    // see https://github.com/postcss/autoprefixer#options
    autoprefixer: {
    },

    // PostCSS plugins and options
    // see https://github.com/postcss/postcss
    postcss: {
        plugins: [],
        options: {},
    },

    // Production only settings, overwrites default settings
    production: {
        // Source maps dsabled in production mode
        sourcemaps: false,

        // Minify CSS in production mode
        // see https://cssnano.co/guides/optimisations
        cssnano: {
            zindex: false,
            mergeIdents: false,
            reduceIdents: false,
            discardUnused: {
                fontFace: false
            }
        },
    },

    // Development only settings, overwrites default settings
    development: {
        // Enable source maps in development mode
        sourcemaps: {
            init: {},
            write: {}
        },

        // Minification disabled in development mode
        cssnano: false,
    },
};

exports.preprocess = {
    stylesheets: [
        require('./preprocess-config'),
    ]
};

exports.tasks = {
    stylesheets: [
        require('./task'),
    ]
};
