import gulp  from 'gulp';
import gulpif  from 'gulp-if';
import postcss  from 'gulp-postcss';
import sourcemaps  from 'gulp-sourcemaps';
import nanomemoize from 'nano-memoize';
import cached  from 'gulp-cached';
import dependents  from 'gulp-dependents';

import globs  from './../../lib/globs-helper.js';
import { getDestPath, getSourcePaths } from '../../lib/get-path.js';
import { getTaskConfig } from '../../lib/get-config.js';

import taskStart  from '../../lib/gulp/task-start.js';
import taskEnd  from '../../lib/gulp/task-end.js';
import taskBeforeDest  from '../../lib/gulp/task-before-dest.js';
import taskWatch  from '../../lib/gulp/task-watch.js';


const getWatchGlobPaths = function (forChokidar = false) {
    const sourcePaths = getSourcePaths('stylesheets');
    const extensions = getTaskConfig('stylesheets', 'extensions');
    const ignore = getTaskConfig('stylesheets', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(),          // List of files which to ignore
        forChokidar,
    );
};

const getGlobPaths = nanomemoize.nanomemoize(function () {
    return getWatchGlobPaths(false);
});


const getEngine = function () {
    const engine = getTaskConfig('stylesheets', 'engine');
    return engine ? engine() : (() => {});
};


function stylesheets () {
    return gulp.src(getGlobPaths())
        .pipe(taskStart())

        // Faster incremental builds, skip files which didn't changed or their dependencies didn't changed
        .pipe(gulpif(!!getTaskConfig('stylesheets', 'dependents'), cached('stylesheets')))
        .pipe(gulpif(!!getTaskConfig('stylesheets', 'dependents'), dependents(getTaskConfig('dependents'))))

        .pipe(gulpif(!!getTaskConfig('stylesheets', 'sourcemaps'), sourcemaps.init(getTaskConfig('stylesheets', 'sourcemaps', 'init')))) // Start Sourcemaps

        // Engine
        .pipe(gulpif(!!getTaskConfig('stylesheets', 'engine'), getEngine()))

        // Autoprefixer, postcss
        .pipe(gulpif(!!getTaskConfig('stylesheets', 'postcss'), postcss(getTaskConfig('stylesheets', 'postcss', 'plugins'), getTaskConfig('stylesheets', 'postcss', 'options'))))

        .pipe(gulpif(!!getTaskConfig('stylesheets', 'sourcemaps'), sourcemaps.write('.', getTaskConfig('stylesheets', 'sourcemaps', 'write'))))

        .pipe(taskBeforeDest())
        .pipe(gulp.dest(getDestPath('stylesheets')))

        // Reload on change
        .pipe(taskEnd());
}

function stylesheetsWatch () {
    return taskWatch(getWatchGlobPaths(true), stylesheets);
}


export const build = stylesheets;
export const watch = stylesheetsWatch;
