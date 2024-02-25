/**
 * Similar to parallel() and serial() but instead of getting tasks immediatelly
 * it's executed after config has been loaded
 */
module.exports = function resolveDynamicTask (fn) {
    if (fn.dynamicTasks) {
        return fn();
    } else {
        return fn;
    }
}
