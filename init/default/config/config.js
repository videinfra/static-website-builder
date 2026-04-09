/*
 * Task configuration
 * All options will be merged with defaults, but not replaces whole configuration object
 *
 * Default configuration can be seen here https://github.com/videinfra/static-website-builder/tree/master/tasks
 * in each tasks config.js file
 */

export const clean = {};
export const staticFiles = {};
export const html = {};
export const data = {};
export const fonts = {};
export const icons = {};
export const images = {};
export const javascripts = {};
export const stylesheets = {};
export const browserSync = {};
export const sizereport = {};
export const translations = {};

export const plugins = [
    // Enables SASS engine and .sass and .scss file compilation
    (await import('@videinfra/static-website-builder/plugins/sass.js')),

    // Enables TwigJS engine .twig file compilation
    (await import('@videinfra/static-website-builder/plugins/twig.js')),

    // Additional twig plugins
    (await import('@videinfra/static-website-builder/plugins/twig/symfony-filters.js')),
    (await import('@videinfra/static-website-builder/plugins/twig/lodash-filters.js')),
    (await import('@videinfra/static-website-builder/plugins/twig/symfony-functions.js')),
];

/*
 * Path configuration
 * All options will be merged with defaults, but not replaces whole configuration object
 *
 * Default configuration can be seen here https://github.com/videinfra/static-website-builder/tree/master/tasks
 * in each tasks config.js file
 */

export const paths = {
    src: './src',
    dest: './public',
};
