const gulp = require('gulp');
const memoize = require('nano-memoize');

const globs = require('./../../lib/globs-helper');
const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');

const taskStart = require('../../gulp/task-start');
const taskEnd = require('../../gulp/task-end');


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
        .pipe(gulp.dest(getPaths.getDestPath('images')))

        // Reload on change
        .pipe(taskEnd());
}

function imagesWatch () {
    return gulp.watch(getGlobPaths(), images);
}


exports.build = images;
exports.watch = imagesWatch;
