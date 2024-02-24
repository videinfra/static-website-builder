const gulp = require('gulp');
const webpack = require('webpack');
const gulpWebpack = require('../../vendor/webpack-stream/index.js');
const memoize = require('nano-memoize');

const merge = require('../../lib/merge');
const globs = require('./../../lib/globs-helper');
const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');

const taskStart = require('../../lib/gulp/task-start');
const taskEnd = require('../../lib/gulp/task-end');
const taskBeforeDest = require('../../lib/gulp/task-before-dest');


const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('javascripts');
    const extensions = getConfig.getTaskConfig('javascripts', 'webpack', 'resolve', 'extensions');
    const ignore = getConfig.getTaskConfig('javascripts', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(),          // List of files which to ignore
    );
});


function javascripts (watch) {
    return gulp.src(getGlobPaths())
        .pipe(taskStart())

        .pipe(gulpWebpack(
            merge(getConfig.getTaskConfig('javascripts', 'webpack'), {'watch': watch === true}),
            webpack
        ))

        .pipe(taskBeforeDest())
        .pipe(gulp.dest(getPaths.getDestPath('javascripts')))

        // Reload on change
        .pipe(taskEnd());
}

function javascriptsWatch () {
    // webpack watch is used instead of gulp watch
    return javascripts(true);
}


exports.build = javascripts;
exports.watch = javascriptsWatch;
