import { parallel } from 'gulp';
import chokidar from 'chokidar';
import debounce from 'lodash/debounce.js';
import asyncDone from 'async-done';

/**
 * Gulp task watch function using latest chokidar
 * with better OSX support and file watching functionality
 * than outdated gulp.watch
 */
export default function taskWatch(globs, callback, isParallel = false) {
    const parallelCallback = isParallel ? callback : parallel(callback);
    const debouncedCallback = debounce(onChange, 120);
    let running = false;
    let queued = false;

    function onChange() {
        if (running) {
            queued = true;
        } else {
            running = true;
            asyncDone(parallelCallback, runComplete);
        }
    }
    function runComplete(_err) {
        running = false;

        // If we have a run queued, start onChange again
        if (queued) {
            queued = false;
            onChange();
        }
    }

    // Re-check that file matches!
    // This is needed because for ignore filter for extensions we allow filter to go through if there is no Stats object,
    // otherwise `chokidar` will not emit `change` event for new filters and sub-folders.
    // That's why we need to re-check here to make sure that file matches!
    function isIgnoredPath(path) {
        return globs.ignore.some((ignore) => ignore(path));
    }

    if (!globs.paths) {
        throw new Error('No paths provided for chokidar watch');
    }

    return chokidar
        .watch(globs.paths, {
            ignoreInitial: true,
        })
        .on('add', (path) => {
            if (!isIgnoredPath(path)) {
                debouncedCallback(path);
            }
        })
        .on('change', (path) => {
            if (!isIgnoredPath(path)) {
                debouncedCallback(path);
            }
        })
        .on('unlink', (path) => {
            if (!isIgnoredPath(path)) {
                debouncedCallback(path);
            }
        });
}
