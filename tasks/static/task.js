import gulp from 'gulp';
import nanomemoize from 'nano-memoize';

import globs from './../../lib/globs-helper.js';
import { getDestPath, getSourcePaths } from './../../lib/get-path.js';
import { getTaskConfig } from './../../lib/get-config.js';

import taskStart from '../../lib/gulp/task-start.js';
import taskEnd from '../../lib/gulp/task-end.js';
import taskBeforeDest from '../../lib/gulp/task-before-dest.js';
import taskWatch from '../../lib/gulp/task-watch.js';

const getWatchGlobPaths = function (forChokidar = false) {
    const sourcePaths = getSourcePaths('staticFiles');
    const ignore = getTaskConfig('staticFiles', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).allFiles(), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(), // List of files which to ignore
        forChokidar,
    );
};
const getGlobPaths = nanomemoize.nanomemoize(function () {
    return getWatchGlobPaths(false);
});

function staticFiles() {
    return (
        gulp
            .src(getGlobPaths(), {
                since: gulp.lastRun(staticFiles),
                // Don't decode / encode binary files, this would break them
                encoding: false,
            })
            .pipe(taskStart())

            .pipe(taskBeforeDest())
            .pipe(gulp.dest(getDestPath('staticFiles')))

            // Reload on change
            .pipe(taskEnd())
    );
}

function staticFilesWatch() {
    return taskWatch(getWatchGlobPaths(true), staticFiles);
}

export const build = staticFiles;
export const watch = staticFilesWatch;
