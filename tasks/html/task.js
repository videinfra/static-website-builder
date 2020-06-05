const gulp = require('gulp');
const data = require('gulp-data');
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin')
const memoize = require('nano-memoize');

const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');
const globs = require('./../../lib/globs-helper');

const taskStart = require('../../gulp/task-start');
const taskEnd = require('../../gulp/task-end');

const getData = require('../data/get-data');


const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('html');
    const extensions = getConfig.getTaskConfig('html', 'extensions');
    const ignore = getConfig.getTaskConfig('html', 'ignore');

    return globs.generate([
        globs.paths(sourcePaths).withExtensions(extensions), // HTML / TWIG files
        globs.paths(sourcePaths).paths(ignore).ignore(),     // Exclude files and folders from being rendered
    ]);
});

const getWatchGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('html');
    const extensions = getConfig.getTaskConfig('html', 'extensions');
    const dataExtensions = getConfig.getTaskConfig('data', 'extensions');

    return globs.generate(
        globs.paths(sourcePaths).withExtensions(extensions), // HTML / TWIG files
        globs.paths(sourcePaths).withExtensions(dataExtensions)  // Data files
    );
});


const getEngine = memoize(function () {
    const engine = getConfig.getTaskConfig('html', 'engine');
    return engine ? engine() : (() => {});
});


function html () {
    return gulp.src(getGlobPaths())
        .pipe(taskStart())

        // Preprocess using TWIG
        .pipe(gulpif(!!getConfig.getTaskConfig('html', 'engine'), data(getData)))
        .pipe(gulpif(!!getConfig.getTaskConfig('html', 'engine'), getEngine()))

        // Minify
        .pipe(gulpif(getConfig.getTaskConfig('html', 'htmlmin'), htmlmin(getConfig.getTaskConfig('html', 'htmlmin'))))

        .pipe(gulp.dest(getPaths.getDestPath('html')))

        // Reload on change
        .pipe(taskEnd());
}

function htmlWatch () {
    return gulp.watch(getWatchGlobPaths(), html);
}


exports.build = html;
exports.watch = htmlWatch;
