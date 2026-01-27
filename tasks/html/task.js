const gulp = require('gulp');
const data = require('gulp-data');
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin')
const memoize = require('nano-memoize');
const cached = require('gulp-cached');
const dependents = require('gulp-dependents');
const ignore = require('gulp-ignore');

const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');
const globs = require('./../../lib/globs-helper');

const taskStart = require('../../lib/gulp/task-start');
const taskEnd = require('../../lib/gulp/task-end');
const taskBeforeDest = require('../../lib/gulp/task-before-dest');
const taskWatch = require('../../lib/gulp/task-watch');

const getData = require('../data/get-data');


const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('html');
    const extensions = getConfig.getTaskConfig('html', 'extensions');

    return globs.generate([
        globs.paths(sourcePaths).filesWithExtensions(extensions), // HTML / TWIG files
    ]);
});

const getGlobIgnorePaths = memoize(function () {
    const ignore = getConfig.getTaskConfig('html', 'ignore');

    return globs.generate([
        globs.paths(ignore),         // Exclude files and folders from being rendered
    ]);
});

const getWatchGlobPaths = function () {
    const sourcePaths = getPaths.getSourcePaths('html');
    const extensions = getConfig.getTaskConfig('html', 'extensions'); // HTML / TWIG files
    const dataExtensions = getConfig.getTaskConfig('data', 'extensions'); // Data files

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions.concat(dataExtensions)),
        true, // for chokidar
    );
};


const getEngine = memoize(function () {
    const engine = getConfig.getTaskConfig('html', 'engine');
    return engine ? engine() : (() => {});
});

function html (options) {
    const build = options && !!options.build;

    return function html () {
        return gulp.src(getGlobPaths())
            .pipe(taskStart())

            // Faster incremental builds, skip files which didn't changed or their dependencies didn't changed
            .pipe(gulpif(!!getConfig.getTaskConfig('html', 'dependents'), cached('html')))
            .pipe(gulpif(!!getConfig.getTaskConfig('html', 'dependents'), dependents(getConfig.getTaskConfig('dependents'))))

            // Prevent file from being rendered if it's in the ignore list
            .pipe(ignore.exclude(getGlobIgnorePaths(), {}))

            // Preprocess using TWIG
            .pipe(gulpif(!!getConfig.getTaskConfig('html', 'engine'), data(getData({ build: build }))))
            .pipe(gulpif(!!getConfig.getTaskConfig('html', 'engine'), getEngine()))

            // Minify
            .pipe(gulpif(!!getConfig.getTaskConfig('html', 'htmlmin'), htmlmin(getConfig.getTaskConfig('html', 'htmlmin'))))

            .pipe(taskBeforeDest())
            .pipe(gulp.dest(getPaths.getDestPath('html')))

            // Reload on change
            .pipe(taskEnd());
    };
}

function htmlWatch () {
    return taskWatch(getWatchGlobPaths(), html({ build: false }));
}

exports.build = html({ build: true });
exports.watch = htmlWatch;
