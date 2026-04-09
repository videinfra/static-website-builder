import preprocessTranslationsConfig from './preprocess-config.js';

/**
 * Translations loading for HTML task
 * This task doesn't have actual task, instead it's used by 'html' task
 */

export const translations = {
    // List of locales, must be set only if there is more than 1 locale
    locales: [],

    // Default locale
    defaultLocale: '',
};

/**
 * Paths relative to the global src and dest folders
 */
export const paths = {
    translations: {
        src: 'translations',
    },
};

export const preprocess = {
    translations: [
        preprocessTranslationsConfig,
    ]
};
