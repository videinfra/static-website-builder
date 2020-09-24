exports.stylesheets = {
    // Engine is a function which returns a gulp pipe function, eg. sass()
    // Intended to be used by plugins, not manually
    engine: null,

    // Glob list of files, which to ignore, relative to the stylesheet source folder
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // File extensions
    extensions: ['css'],

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
            // Preset
            preset: 'default',

            // Configuration options
            calc: false,
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
        // See https://www.npmjs.com/package/gulp-sourcemaps
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


/**
 * Paths relative to the global src and dest folders
 */
exports.paths = {
    stylesheets: {
        'src': 'stylesheets',
        'dest': 'assets/stylesheets',
    }
};
