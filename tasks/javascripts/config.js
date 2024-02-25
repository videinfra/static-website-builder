exports.javascripts = {
    // Glob list of files, which to ignore, relative to the javascript source folder
    // see https://gulpjs.com/docs/en/getting-started/explaining-globs/
    ignore: [],

    // JS file extensions
    extensions: ['js', 'json'],

    // Instead of 'entry' we provide filename which list all entries
    // Can be either an object or array of object to have multiple webpack
    // build, one for each of the entry list files
    entryList: {
        // Path to the entry list file
        name: '_entries.js',

        // Entry shared chunk name, creates webpack.optimization chunks
        shared: 'shared',
    },

    // Webpack configuration
    // see https://webpack.js.org/configuration/
    webpack: {
        resolve: {
            // extensions are copied from 'extensions' config by preprocess
            alias: {}
        },

        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-proposal-object-rest-spread']
                        }
                    }
                }
            ],
        },

        // Default optimization, 'shared' will be overwritten by entryList.shared value
        optimization: {
            runtimeChunk: {
                name: 'shared'
            },
            splitChunks: {
                cacheGroups: {
                    default: false,
                    vendor: false,

                    shared: {
                        name: 'shared',
                        chunks: 'all',
                        minChunks: 3,
                        enforce: true,
                    }
                }
            }
        },

        output: {
            filename: './[name].js',
        },

        // Webpack plugins, either an array or a function which return an array of plugins
        plugins: [],

        performance: {
            // Disable entrypoint size limit warning
            hints: false,
        },

        // stats: 'minimal'
        stats: 'errors-warnings',

    },

    // Production only settings, overwrites default settings
    production: {
        webpack: {
            // Source maps
            devtool: false,
        },
    },

    // Development only settings, overwrites default settings
    development: {
        webpack: {
            // Source maps
            devtool: 'eval-cheap-source-map',
        },
    },
};

exports.preprocess = {
    javascripts: [
        require('./preprocess-config'),
    ]
};

exports.tasks = {
    javascripts: [
        require('./task'),
    ]
};


/**
 * Paths relative to the global src and dest folders
 */
exports.paths = {
    javascripts: {
        'src': 'javascripts',
        'dest': 'assets/javascripts',
    }
};
