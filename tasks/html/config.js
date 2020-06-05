exports.html = {
    // Engine is a function which returns a gulp pipe function, eg. twig()
    engine: null,

    // Filename extensions
    extensions: ['html'],

    // Folder which to exclude from rendering, relative to the template folder
    excludeFolders: [],

    // Production only settings, overwrites default settings
    production: {
        // Enable HTML minification
        htmlmin: {}
    },

    // Development only settings, overwrites default settings
    development: {
        // Disable HTML minification
        htmlmin: false
    },
};

exports.tasks = {
    html: [
        require('./task'),
    ]
};
