import getEnvData  from '../env/get-env.js';
import { getTaskConfig } from './../../lib/get-config.js';

/**
 * Modify configuration
 *
 * @param {object} config Sitemap configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed sitemap configuration
 */
export default function preprocessSitemapConfig (config = {}, fullConfig) {
    const envData = getEnvData();

    // Set host
    config.sitemap = config.sitemap || {};
    config.sitemap.siteUrl = envData.env.host;

    // Languages
    const translationConfig = getTaskConfig('translations');
    const locales = translationConfig.locales;
    const defaultLocale = translationConfig.defaultLocale;

    if (locales.length > 1) {
        // Add all other locales to ignore list
        config.ignore = config.ignore || [];
        config.ignore = config.ignore.concat(locales.map(function(locale) {
            return locale + '/**';
        }));

        // Set hreflang
        config.sitemap.hreflang = locales.map(function(locale) {
            return {
                lang: locale,
                getHref: function(siteUrl, file, locale) {
                    let url;

                    if (locale !== defaultLocale) {
                        url = siteUrl + '/' + locale + '/' + file;
                    } else {
                        url = siteUrl + '/' + file;
                    }

                    return url.replace(/([^:])\/{2,}/g, '$1/').replace(/\/$/, '');
                }
            };
        });
    }

    return config;
}
