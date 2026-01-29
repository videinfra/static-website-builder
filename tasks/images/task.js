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
    const sourcePaths = getSourcePaths('images');
    const ignore = getTaskConfig('images', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).allFiles(), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(), // List of files which to ignore
        forChokidar,
    );
};
const getGlobPaths = nanomemoize.nanomemoize(function () {
    return getWatchGlobPaths(false);
});

function images() {
    return (
        gulp
            .src(getGlobPaths(), { since: gulp.lastRun(images) })
            .pipe(taskStart())

            .pipe(taskBeforeDest())
            .pipe(gulp.dest(getDestPath('images')))

            // Reload on change
            .pipe(taskEnd())
    );
}

function imagesWatch() {
    return taskWatch(getWatchGlobPaths(true), images);
}

export const build = images;
export const watch = imagesWatch;
