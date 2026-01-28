/*
 * Task configuration
 * All options will be merged with defaults, but not replaces whole configuration object
 *
 * Default configuration can be seen here https://github.com/videinfra/static-website-builder/tree/master/tasks
 * in each tasks config.js file
 */

import * as sassPlugin from '@videinfra/static-website-builder/plugins/sass';
import * as twigPlugin from '@videinfra/static-website-builder/plugins/twig';

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

export const plugins = [
    // Enables SASS engine and .sass and .scss file compilation
    sassPlugin,

    // Enables TwigJS engine .twig file compilation
    twigPlugin,
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
