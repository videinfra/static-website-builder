import gulp from 'gulp';
import data from 'gulp-data';
import gulpif from 'gulp-if';
import htmlmin from 'gulp-htmlmin';
import nanomemoize from 'nano-memoize';
import cached from 'gulp-cached';
import dependents from 'gulp-dependents';
import ignore from 'gulp-ignore';

import { getSourcePaths, getDestPath } from './../../lib/get-path.js';
import { getTaskConfig } from './../../lib/get-config.js';
import globs from './../../lib/globs-helper.js';

import taskStart from '../../lib/gulp/task-start.js';
import taskEnd from '../../lib/gulp/task-end.js';
import taskBeforeDest from '../../lib/gulp/task-before-dest.js';
import taskWatch from '../../lib/gulp/task-watch.js';

import getData from '../data/get-data.js';

const getGlobPaths = nanomemoize.nanomemoize(function () {
    const sourcePaths = getSourcePaths('html');
    const extensions = getTaskConfig('html', 'extensions');

    return globs.generate([
        globs.paths(sourcePaths).filesWithExtensions(extensions), // HTML / TWIG files
    ]);
});

const getGlobIgnorePaths = nanomemoize.nanomemoize(function () {
    const ignore = getTaskConfig('html', 'ignore');

    return globs.generate([
        globs.paths(ignore), // Exclude files and folders from being rendered
    ]);
});

const getWatchGlobPaths = function () {
    const sourcePaths = getSourcePaths('html');
    const extensions = getTaskConfig('html', 'extensions'); // HTML / TWIG files
    const dataExtensions = getTaskConfig('data', 'extensions'); // Data files

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions.concat(dataExtensions)),
        true, // for chokidar
    );
};

const getEngine = function () {
    const engine = getTaskConfig('html', 'engine');
    return engine ? engine() : () => {};
};

function html(options) {
    const build = options && !!options.build;

    return function html() {
        return (
            gulp
                .src(getGlobPaths())
                .pipe(taskStart())

                // Faster incremental builds, skip files which didn't changed or their dependencies didn't changed
                .pipe(gulpif(!!getTaskConfig('html', 'dependents'), cached('html')))
                .pipe(gulpif(!!getTaskConfig('html', 'dependents'), dependents(getTaskConfig('dependents'))))

                // Prevent file from being rendered if it's in the ignore list
                .pipe(ignore.exclude(getGlobIgnorePaths(), {}))

                // Preprocess using TWIG
                .pipe(gulpif(!!getTaskConfig('html', 'engine'), data(getData({ build: build }))))
                .pipe(gulpif(!!getTaskConfig('html', 'engine'), getEngine()))

                // Minify
                .pipe(gulpif(!!getTaskConfig('html', 'htmlmin'), htmlmin(getTaskConfig('html', 'htmlmin'))))

                .pipe(taskBeforeDest())
                .pipe(gulp.dest(getDestPath('html')))

                // Reload on change
                .pipe(taskEnd())
        );
    };
}

function htmlWatch() {
    return taskWatch(getWatchGlobPaths(), html({ build: false }));
}

export const build = html({ build: true });
export const watch = htmlWatch;
