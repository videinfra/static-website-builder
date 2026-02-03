/*
 * Build a project for testing
 */

import * as sassPlugin from '../../../plugins/sass.js';
import * as twigPlugin from '../../../plugins/twig.js';
import * as symfonyFiltersPlugin from '../../../plugins/twig/symfony-filters.js';

export const clean = {};
export const staticFiles = {};
export const html = {};
export const data = {};
export const fonts = {};
export const icons = {};
export const images = {};
export const javascripts = {
    entryList: [
        {
            name: '_entries.js',
            shared: 'shared',
        },
        {
            name: '_entries-alt.js',
            shared: 'shared',
            outpuSubFolder: 'alt'
        },
    ],
};
export const stylesheets = {};
export const sizereport = false;

export const plugins = [
    // Enables SASS engine and .sass and .scss file compilation
    sassPlugin,

    // Enables TwigJS engine .twig file compilation
    twigPlugin,

    // Enables TWIG Symfony filters
    symfonyFiltersPlugin,
];

export const env = {
    // Write ASSET_VERSION to .env file to enable cache busting
    // writeAssetVersion: './init/test/.env.local',

    // How env variable names should be remapped
    map: {
        'HOST': 'host',
        'FOO': 'foo',
        'BAR': 'bar',
        'TYPE_BOOL_TRUE': 'typeBoolTrue',
        'TYPE_BOOL_FALSE': 'typeBoolFalse',
        'TYPE_NUMBER': 'typeNumber',
        'TYPE_EMPTY': 'typeEmpty',
    },
};

/*
 * Path configuration
 * All options will be merged with defaults, but not replaces whole configuration object
 *
 * Default configuration can be seen here https://github.com/videinfra/static-website-builder/tree/master/tasks
 * in each tasks config.js file
 */

export const paths = {
    src: './init/test/src',
    dest: './tests/build/public',
    env: ['./init/test/.env', './init/test/.env.local'],
};
