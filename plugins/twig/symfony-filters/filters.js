module.exports = [];

/**
 * CDN filter
 * Adds a CDN path to the url
 *
 * @example
 *   {{ '/images/px.gif' | cdn }}
 */

const config = require('../../../lib/get-config');
const cdnsResourceMap = {};
let   cdnIndex = -1;

module.exports.push({
    name: 'cdnify',
    func: function (path) {
        const normalizedPath = (path || path === 0 ? String(path) : '');
        const cdnsConfig = config.getTaskConfig('html', 'cdns');

        if (cdnsResourceMap[normalizedPath]) return cdnsResourceMap[normalizedPath]; // cache so that same resource always use same cdn
        if (!cdnsConfig || !cdnsConfig.length) return normalizedPath;

        cdnIndex = (cdnIndex + 1) % cdnsConfig.length;
        cdnsResourceMap[normalizedPath] = cdnsConfig[cdnIndex] + normalizedPath.replace(/^[a-z]+:\/\/[^/]+/i);
        return cdnsResourceMap[normalizedPath];
    }
});


/**
 * Version filter
 * Adds a random version string to the url
 *
 * @example
 *   {{ '/images/px.gif' | version }}
 *   Output: /images/px.gif?dshnv
 */

const version = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);

module.exports.push({
    name: 'version',
    func: function (path) {
        if (!config.getTaskConfig('html', 'version')) return path;

        const normalizedPath = (path || path === 0 ? String(path) : '');
        const parts    = normalizedPath.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/i);
        const pathname = parts[1];
        const params   = parts[2] || '';
        const hash     = parts[3] || '';

        return pathname + params + (params ? '&' : '?') + version + hash;
    }
});


/**
 * Humanize filter
 * Makes a technical name human readable
 *
 * @example
 *   {{ 'helloWorld' | humanize }}
 *   Output: hello world
 */

module.exports.push({
    name: 'humanize',
    func: function (text) {
        text = String(text);
        text = text.replace(/([A-Z])/g, '_$1');
        text = text.replace(/[_\s]+/g, ' ');
        text = text.toLowerCase();
        text = text.trim();
        text = text.slice(0,1 ).toUpperCase() + text.slice(1);

        return text;
    }
});



