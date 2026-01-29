import gulp from 'gulp';
import nanomemoize from 'nano-memoize';

import globs from './../../lib/globs-helper.js';
import { getSourcePaths, getDestPath } from './../../lib/get-path.js';
import { getTaskConfig } from './../../lib/get-config.js';

import taskStart from '../../lib/gulp/task-start.js';
import taskEnd from '../../lib/gulp/task-end.js';
import taskBeforeDest from '../../lib/gulp/task-before-dest.js';
import taskWatch from '../../lib/gulp/task-watch.js';

const getWatchGlobPaths = function (forChokidar = false) {
    const sourcePaths = getSourcePaths('fonts');
    const extensions = getTaskConfig('fonts', 'extensions');
    const ignore = getTaskConfig('fonts', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(), // List of files which to ignore
        forChokidar,
    );
};
const getGlobPaths = nanomemoize.nanomemoize(function () {
    return getWatchGlobPaths(false);
});

function fonts() {
    return (
        gulp
            .src(getGlobPaths(), { since: gulp.lastRun(fonts) })
            .pipe(taskStart())

            .pipe(taskBeforeDest())
            .pipe(gulp.dest(getDestPath('fonts')))

            // Reload on change
            .pipe(taskEnd())
    );
}

function fontsWatch() {
    return taskWatch(getWatchGlobPaths(true), fonts);
}

export const build = fonts;
export const watch = fontsWatch;
