const gulp = require('gulp');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync');
const flatten = require('lodash/flatten');
const memoize = require('nano-memoize');

const paths = require('./../../lib/get-path');
const config = require('./../../lib/get-config');


const getGlobPaths = memoize(function () {
    return flatten([
        paths.getGlobPaths(paths.getSourcePaths('fonts')),
        paths.normalizeGlob(paths.getSourcePaths('fonts', ...config.getTaskConfig('fonts', 'ignore')).map(path => '!' + path))
    ]);
});


function fonts () {
    return gulp
        .src(getGlobPaths(), { since: gulp.lastRun(fonts) })
        .pipe(gulp.dest(paths.getDestPath('fonts')))

        // Reload on change
        .pipe(gulpif(!!config.getTaskConfig('browserSync'), browserSync.stream()));
}

function fontsWatch () {
    return gulp.watch(getGlobPaths(), fonts);
}


exports.build = fonts;
exports.watch = fontsWatch;
