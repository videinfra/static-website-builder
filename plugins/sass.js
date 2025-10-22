/**
 * SASS plugin attaches itself to the stylesheets task
 */
exports.stylesheets = {
    // Add sass to the extensions
    extensions: ['scss', 'sass'],

    // Silence deprecations for `sass`
    legacy: true,

    // SASS options
    // see https://sass-lang.com/documentation/js-api/interfaces/options/
    sass: {
        includePaths: ['./node_modules'],
        silenceDeprecations: ['legacy-js-api'],
    },

    // Dependents plugin for faster builds
    dependents: {
        '.scss': {
            parserSteps:
            [
                // The language semantics allow import statements with a comma-separated list of file paths.
                // Therefore, we first extract the whole statement, and then extract each of the paths from that.
                /(?:^|;|{|}|\*\/)\s*@(import|use|forward)\s+((?:"[^"]+"|'[^']+'|url\((?:"[^"]+"|'[^']+'|[^)]+)\))(?:\s*,\s*(?:"[^"]+"|'[^']+'|url\((?:"[^"]+"|'[^']+'|[^)]+)\)))*)(?=[^;]*;)/gm,
                /"([^"]+)"|'([^']+)'|url\((?:"([^"]+)"|'([^']+)'|([^)]+))\)/gm
            ],
            prefixes: ['', '_'],
            postfixes: ['.scss', '.sass'],
            basePaths: []
        },
    },
};

exports.preprocess = {
    stylesheets: [
        require('./sass-engine/preprocess-config'),
    ]
};
