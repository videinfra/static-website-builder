const gulp = require('gulp');
const data = require('gulp-data');
const gulpif = require('gulp-if');
const htmlmin = require('gulp-htmlmin')
const map = require('lodash/map');
const memoize = require('nano-memoize');
const browserSync = require('browser-sync');

const plumber = require('gulp-plumber');
const logError = require('./../../lib/log-error');

const paths = require('./../../lib/get-path');
const config = require('./../../lib/get-config');

const getData = require('../data/get-data');


const getGlobPaths = memoize(function () {
    // HTML / TWIG files
    const sourcePaths = paths.getSourcePaths('html');
    const extensions = config.getTaskConfig('html', 'extensions');
    const htmlGlobs = paths.getGlobPaths(sourcePaths, extensions);

    // Exclude folders from being rendered
    let excludes = config.getTaskConfig('html', 'excludeFolders');
    let excludePaths = map(excludes, (excludePath) => paths.getSourcePaths('html', excludePath));
    const excludeGlobs = paths.getGlobPaths(excludePaths).map(path => '!' + path);

    return htmlGlobs.concat(excludeGlobs);
});

const getWatchGlobPaths = memoize(function () {
    // HTML / TWIG files
    const sourcePaths = paths.getSourcePaths('html');
    const extensions = config.getTaskConfig('html', 'extensions');
    const htmlGlobs = paths.getGlobPaths(sourcePaths, extensions);

    // Add data files for watch
    const dataSourcePaths = paths.getSourcePaths('data');
    const dataExtensions = config.getTaskConfig('data', 'extensions');
    const dataGlobs = paths.getGlobPaths(dataSourcePaths, dataExtensions);

    return htmlGlobs.concat(dataGlobs);
});

const getEngine = memoize(function () {
    const engine = config.getTaskConfig('html', 'engine');

    if (engine) {
        return engine();
    } else {
        return () => {};
    }
});

function html () {
    return gulp.src(getGlobPaths())
        .pipe(plumber(logError))

        // Preprocess using TWIG
        .pipe(gulpif(!!config.getTaskConfig('html', 'engine'), data(getData)))
        .pipe(gulpif(!!config.getTaskConfig('html', 'engine'), getEngine()))

        // Minify
        .pipe(gulpif(config.getTaskConfig('html', 'htmlmin'), htmlmin(config.getTaskConfig('html', 'htmlmin'))))

        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.getDestPath('html')))

        // Reload on change
        .pipe(gulpif(!!config.getTaskConfig('browserSync'), browserSync.stream()));
}

function htmlWatch () {
    return gulp.watch(getWatchGlobPaths(), html);
}


exports.build = html;
exports.watch = htmlWatch;
