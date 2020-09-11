const gulp = require('gulp');
const memoize = require('nano-memoize');

const globs = require('./../../lib/globs-helper');
const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');

const taskStart = require('../../lib/gulp/task-start');
const taskEnd = require('../../lib/gulp/task-end');
const taskBeforeDest = require('../../lib/gulp/task-before-dest');


const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('images');
    const ignore = getConfig.getTaskConfig('images', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).allFiles(),             // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(), // List of files which to ignore
    );
});


function images () {
    return gulp
        .src(getGlobPaths(), { since: gulp.lastRun(images) })
        .pipe(taskStart())

        .pipe(taskBeforeDest())
        .pipe(gulp.dest(getPaths.getDestPath('images')))

        // Reload on change
        .pipe(taskEnd());
}

function imagesWatch () {
    return gulp.watch(getGlobPaths(), images);
}


exports.build = images;
exports.watch = imagesWatch;
