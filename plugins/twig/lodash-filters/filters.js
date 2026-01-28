const exports = [];

/**
 * Filter with lodash 'omit' functionality
 * !!!CAUTION!!! There is no filter in TWIG with this functionality!
 */

exports.push({
    name: 'omit',
    func: function (data, args) {
        const output = {};
        const keys = args[0] || [];

        for (let key in data) {
            if (key !== '_keys' && keys.indexOf(key) === -1) {
                output[key] = data[key];
            }
        }

        return output;
    }
});

/**
 * Filter with lodash 'pick' functionality
 * !!!CAUTION!!! There is no filter in TWIG with this functionality!
 */

exports.push({
    name: 'pick',
    func: function (data, args) {
        const output = {};
        const keys = args[0] || [];

        for (let key in data) {
            if (key !== '_keys' && keys.indexOf(key) !== -1) {
                output[key] = data[key];
            }
        }

        return output;
    }
});

/**
 * Filter with lodash 'filter' functionality
 * !!!CAUTION!!! There is no filter in TWIG with this functionality!
 */

import filter  from 'lodash/filter.js';
import omit  from 'lodash/omit.js';

exports.push({
    name: 'filter',
    func: function (data, args) {
        const predicate = omit(args[0], ['_keys']);
        return filter(data, predicate);
    }
});

/**
 * Filter with lodash 'reject' functionality
 * !!!CAUTION!!! There is no reject in TWIG with this functionality!
 */

import reject  from 'lodash/reject.js';

exports.push({
    name: 'reject',
    func: function (data, args) {
        const predicate = omit(args[0], ['_keys']);
        return reject(data, predicate);
    }
});

/**
 * Filter with lodash 'find' functionality
 * !!!CAUTION!!! There is no filter in TWIG with this functionality!
 */

import find  from 'lodash/find.js';

exports.push({
    name: 'find',
    func: function (data, args) {
        const predicate = omit(args[0], ['_keys']);
        return find(data, predicate);
    }
});

export default exports;
