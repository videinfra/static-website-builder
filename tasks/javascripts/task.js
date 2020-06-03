const gulp = require('gulp');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');
const plumber = require('gulp-plumber');

const merge = require('../../lib/merge');
const paths = require('./../../lib/get-path');
const config = require('./../../lib/get-config');
const logError = require('./../../lib/log-error');

let gulpTaskSourcePaths;


function getGlobPaths () {
    if (!gulpTaskSourcePaths) {
        const sourcePaths = paths.getSourcePaths('javascripts');
        const extensions = config.getTaskConfig('javascripts', 'webpack', 'resolve', 'extensions');
        gulpTaskSourcePaths = paths.getGlobPaths(sourcePaths, extensions);
    }

    return gulpTaskSourcePaths;
}

function javascripts (watch) {
    return gulp.src(getGlobPaths())
        .pipe(plumber(logError))

        .pipe(gulpWebpack(
            merge(config.getTaskConfig('javascripts', 'webpack'), {'watch': watch === true}),
            webpack
        ))

        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.getDestPath('javascripts')))

        // Reload on change
        .pipe(gulpif(!!config.getTaskConfig('browserSync'), browserSync.stream()));
}

function javascriptsWatch () {
    // webpack watch is used instead of gulp watch
    return javascripts(true);
}


exports.build = javascripts;
exports.watch = javascriptsWatch;
