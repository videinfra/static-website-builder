/**
 * Similar to parallel() and serial() but instead of getting tasks immediatelly
 * it's executed after config has been loaded
 */
export default function dynamicTask (fn) {
    fn.dynamicTasks = true;
    return fn;
}
