module.exports = [];

/**
 * Filter with lodash 'omit' functionality
 * !!!CAUTION!!! There is no filter in TWIG with this functionality!
 */

module.exports.push({
    name: 'omit',
    func: function (data, args) {
        const output = {};
        const keys = args[0] || [];

        for (let key in data) {
            if (keys.indexOf(key) === -1) {
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

module.exports.push({
    name: 'pick',
    func: function (data, args) {
        const output = {};
        const keys = args[0] || [];

        for (let key in data) {
            if (keys.indexOf(key) !== -1) {
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

const filter = require('lodash/filter');
const omit = require('lodash/omit');

module.exports.push({
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

const reject = require('lodash/reject');

module.exports.push({
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

const find = require('lodash/find');

module.exports.push({
    name: 'find',
    func: function (data, args) {
        const predicate = omit(args[0], ['_keys']);
        return find(data, predicate);
    }
});
