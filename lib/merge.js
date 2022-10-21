const isArray = require('lodash/isArray');
const mergeWith = require('lodash/mergeWith');

function customizer (objValue, srcValue, key) {
    if (objValue !== srcValue && isArray(objValue) && isArray(srcValue)) {
        return objValue.concat(srcValue);
    }
}

/**
 * Merge multiple objest together, with array concatanation
 * object is mutated
 *
 * @param {object|array} object Object into which to merge into
 * @param {object|array} ...sources List of sources which to merge into object
 * @returns {object|array} Merged object
 */
module.exports = function merge (object, ...sources) {
    for (let i = 0; i < sources.length; i++) {
        if (sources[i] && typeof sources[i] === 'object') {
            object = mergeWith(object, sources[i], customizer);
        } else {
            object = sources[i];
        }
    }
    return object;
}
