import getEnvData  from '../env/get-env.js';

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

    return config;
}
