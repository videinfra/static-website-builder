const gulp = require('gulp');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const flatten = require('lodash/flatten');
const memoize = require('nano-memoize');
const merge = require('../../lib/merge');

const plumber = require('gulp-plumber');
const logError = require('./../../lib/log-error');

const paths = require('./../../lib/get-path');
const config = require('./../../lib/get-config');


const getGlobPaths = memoize(function () {
    return flatten([
        paths.getGlobPaths(paths.getSourcePaths('icons'), config.getTaskConfig('icons', 'extensions')),
        paths.normalizeGlob(paths.getSourcePaths('icons', ...config.getTaskConfig('icons', 'ignore')).map(path => '!' + path))
    ]);
});


function icons () {
    return gulp
        .src(getGlobPaths())
        .pipe(plumber(logError))

        // Minify SVG
        .pipe(gulpif(!!config.getTaskConfig('icons', 'svgmin'), svgmin(config.getTaskConfig('icons', 'svgmin'))))

        // Create sprite
        .pipe(svgstore(config.getTaskConfig('icons', 'svgstore')))

        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.getDestPath('icons')))

        // Reload on change
        .pipe(gulpif(!!config.getTaskConfig('browserSync'), browserSync.stream()));
}

function iconsWatch () {
    return gulp.watch(getGlobPaths(), icons);
}


exports.build = icons;
exports.watch = iconsWatch;
