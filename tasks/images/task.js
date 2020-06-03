const gulp = require('gulp');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync');
const flatten = require('lodash/flatten');
const memoize = require('nano-memoize');

const paths = require('./../../lib/get-path');
const config = require('./../../lib/get-config');


const getGlobPaths = memoize(function () {
    return flatten([
        paths.getGlobPaths(paths.getSourcePaths('images')),
        paths.normalizeGlob(paths.getSourcePaths('images', ...config.getTaskConfig('images', 'ignore')).map(path => '!' + path))
    ]);
});


function images () {
    return gulp
        .src(getGlobPaths(), { since: gulp.lastRun(images) })
        .pipe(gulp.dest(paths.getDestPath('images')))

        // Reload on change
        .pipe(gulpif(!!config.getTaskConfig('browserSync'), browserSync.stream()));
}

function imagesWatch () {
    return gulp.watch(getGlobPaths(), images);
}


exports.build = images;
exports.watch = imagesWatch;
