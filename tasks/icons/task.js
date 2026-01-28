import gulp from 'gulp';
import gulpif from 'gulp-if';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import nanomemoize from 'nano-memoize';

import globs from './../../lib/globs-helper.js';
import { getSourcePaths, getDestPath } from './../../lib/get-path.js';
import { getTaskConfig } from './../../lib/get-config.js';

import taskStart from '../../lib/gulp/task-start.js';
import taskEnd from '../../lib/gulp/task-end.js';
import taskBeforeDest from '../../lib/gulp/task-before-dest.js';
import taskWatch from '../../lib/gulp/task-watch.js';

const getWatchGlobPaths = function (forChokidar = false) {
    const sourcePaths = getSourcePaths('icons');
    const extensions = getTaskConfig('icons', 'extensions');
    const ignore = getTaskConfig('icons', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(), // List of files which to ignore
        forChokidar,
    );
};
const getGlobPaths = nanomemoize.nanomemoize(function () {
    return getWatchGlobPaths(false);
});

function icons() {
    return (
        gulp
            .src(getGlobPaths())
            .pipe(taskStart())

            // Minify SVG
            .pipe(gulpif(!!getTaskConfig('icons', 'svgmin'), svgmin(getTaskConfig('icons', 'svgmin'))))

            // Create sprite
            .pipe(svgstore(getTaskConfig('icons', 'svgstore')))

            .pipe(taskBeforeDest())
            .pipe(gulp.dest(getDestPath('icons')))

            // Reload on change
            .pipe(taskEnd())
    );
}

function iconsWatch() {
    return taskWatch(getWatchGlobPaths(true), icons);
}

export const build = icons;
export const watch = iconsWatch;
