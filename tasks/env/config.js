/**
 * Enviromental variable loading configuration
 * Environment variables are loaded from .env files and remapped so that they can
 * be used in TWIG, SASS and JavaScript:
 *     in TWIG `host` is accessible as `host`
 *     in SCSS `host` is accessible as `map-get($env, host)`
 *     in JS `host` is accessible as `process.env.host`
 */

export const env = {
    // How env variable names should be remapped
    // Example:
    //     map: { 'HOST': 'host', 'RECAPTCHA3_PUBLIC_KEY': 'recaptcha3_site_key' }
    map: {}
};

export const paths = {
    // Env files which to load relative to project folder
    env: [
        '../.env',
        '../.env.local',
    ],
};
