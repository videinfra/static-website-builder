/*
 * Build a project for testing
 */

exports.clean = {};
exports.static = {};
exports.html = {};
exports.data = {};
exports.fonts = {};
exports.icons = {};
exports.images = {};
exports.javascripts = {};
exports.stylesheets = {};
exports.browserSync = false;
exports.sizereport = false;

exports.plugins = [
    // Enables SASS engine and .sass and .scss file compilation
    require('../../../plugins/sass'),

    // Enables TwigJS engine .twig file compilation
    require('../../../plugins/twig'),
];


/*
 * Path configuration
 * All options will be merged with defaults, but not replaces whole configuration object
 *
 * Default configuration can be seen here https://github.com/videinfra/static-website-builder/tree/master/tasks
 * in each tasks config.js file
 */

exports.paths = {
    src: './init/test/src',
    dest: './tests/build/public',
};
