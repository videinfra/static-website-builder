import path  from 'path';
import isPlainObject  from 'lodash/isPlainObject.js';
import reduce  from 'lodash/reduce.js';


/**
 * Convert svgmin object configuration into array of objects
 *
 * @param {object} config Configuration
 * @returns {array} Configuration
 */
function convertSVGMINObjectConfigIntoArray (config) {
    reduce(config, (config, value, key) => {
        const obj = {};
        obj[key] = value;
        return config;
    }, []);
}

/**
 * Modify configuration
 *
 * @param {object} config Icons configuration
 * @param {object} fullConfig Full configuration
 * @returns {object} Transformed icons configuration
 */
export default function preprocessIconsConfig (config, fullConfig) {
    // Disable whole task if SVG store is disabled
    if (!config.svgstore) {
        return false;
    }

    // Normalize svgmin config
    if (config && config.svgmin) {
        let svgmin = config._svgmin = config.svgmin;

        if (isPlainObject(svgmin)) {
            // Convert {a:true,b:false} into [{a:true},{b:false}]
            svgmin = config._svgmin = convertSVGMINObjectConfigIntoArray(svgmin);
        } else if (!Array.isArray(svgmin)) {
            svgmin = config._svgmin = [];
        }

        // Use function to output svgmin configuration
        // Add ID attribute transformation
        config.svgmin = function getSVGMinOptions (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }].concat(svgmin)
            }
        };
    }

    return config;
}
