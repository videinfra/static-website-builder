exports.javascripts = {
    // Instead of 'entry' we provide filename which list all entries
    entryList: '_entries.js',

    // Webpack configuration
    // see https://webpack.js.org/configuration/
    webpack: {
        resolve: {
            extensions: ['.js', '.json'],
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

        optimization: {
            splitChunks: {
                cacheGroups: {
                    default: {
                        name: 'shared',
                        chunks: 'initial',
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
