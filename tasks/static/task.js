const gulp = require('gulp');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync');
const flatten = require('lodash/flatten');
const memoize = require('nano-memoize');

const paths = require('./../../lib/get-path');
const config = require('./../../lib/get-config');


const getGlobPaths = memoize(function () {
    return flatten([
        paths.getGlobPaths(paths.getSourcePaths('static')),
        paths.normalizeGlob(paths.getSourcePaths('static', ...config.getTaskConfig('static', 'ignore')).map(path => '!' + path))
    ]);
});


function static () {
    return gulp
        .src(getGlobPaths(), { since: gulp.lastRun(static) })
        .pipe(gulp.dest(paths.getDestPath('static')))

        // Reload on change
        .pipe(gulpif(!!config.getTaskConfig('browserSync'), browserSync.stream()));
}

function staticWatch () {
    return gulp.watch(getGlobPaths(), static);
}


exports.build = static;
exports.watch = staticWatch;
