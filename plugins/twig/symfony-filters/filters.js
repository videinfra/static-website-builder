import { getTaskConfig }  from '../../../lib/get-config.js';
import preposition_nbsp  from './preposition_nbsp.js';

const exports = [];

/**
 * CDN filter
 * Adds a CDN path to the url
 *
 * @example
 *   {{ '/images/px.gif' | cdn }}
 */

const cdnsResourceMap = {};
let   cdnIndex = -1;

exports.push({
    name: 'cdnify',
    func: function (path) {
        const normalizedPath = (path || path === 0 ? String(path) : '');
        const cdnsConfig = getTaskConfig('html', 'cdns');

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

exports.push({
    name: 'version',
    func: function (path) {
        if (!getTaskConfig('html', 'version')) return path;

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

exports.push({
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

/**
 * Preposition filter
 * Adds a non-breaking space between prepositions and other words
 *
 * @example
 *   {{ 'hello at world' | preposition_nbsp }}
 *   Output: hello at&nbsp;world
 */

exports.push({
    name: 'preposition_nbsp',
    func: function (text) {
        return preposition_nbsp(text);
    }
});

export default exports;
