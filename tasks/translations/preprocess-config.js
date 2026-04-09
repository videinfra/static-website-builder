/**
 * Modify configuration
 *
 * @param {object} config Translations configuration
 * @returns {object} Transformed Translations configuration
 */
export default function preprocessTranslationsConfig (config = {}) {
    if ((!config.locales || !config.locales.length) && config.defaultLocale) {
        config.locales = [config.defaultLocale];
    } else if (config.locales && config.locales.length && !config.defaultLocale) {
        config.defaultLocale = config.locales[0];
    } else if ((!config.locales || !config.locales.length) && !config.defaultLocale) {
        // Assume "en" as default
        config.locales = ['en'];
        config.defaultLocale = 'en';
    }

    return config;
}
