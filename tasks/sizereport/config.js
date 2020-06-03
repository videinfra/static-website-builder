/**
 * Generates a size report for all files in the output folder
 */

exports.sizereport = {
    // Development only settings, overwrites default settings
    // disabled for development mode
    development: false,

    // Production only settings, overwrites default settings
    production: {
        gzip: true
    }
};

exports.tasks = {
    sizereport: [
        require('./task'),
    ]
};
