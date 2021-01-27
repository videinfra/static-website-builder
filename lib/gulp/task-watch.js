const gulp = require('gulp');
const chokidar = require('chokidar');
const debounce = require('just-debounce');
const asyncDone = require('async-done');


/**
 * Gulp task watch function using latest chokidar
 * with better OSX support and file watching functionality
 * than outdated gulp.watch
 */
module.exports = function taskWatch (globs, callback) {
    const parallelCallback = gulp.parallel(callback);
    const debouncedCallback = debounce(onChange, 200);
    let running = false;
    let queued = false;

    function onChange () {
        if (running) {
            queued = true;
        } else {
            running = true;
            asyncDone(parallelCallback, runComplete);
        }
    }
    function runComplete (err) {
        running = false;

        // If we have a run queued, start onChange again
        if (queued) {
            queued = false;
            onChange();
        }
    }

    return chokidar.watch(globs, {
        ignoreInitial: true
    })
        .on('add', debouncedCallback)
        .on('change', debouncedCallback)
        .on('unlink', debouncedCallback);
};
