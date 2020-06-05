const gulp = require('gulp');
const memoize = require('nano-memoize');

const globs = require('./../../lib/globs-helper');
const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');

const taskStart = require('../../gulp/task-start');
const taskEnd = require('../../gulp/task-end');


const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('static');
    const ignore = getConfig.getTaskConfig('static', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).allFiles(),             // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(), // List of files which to ignore
    );
});


function static () {
    return gulp
        .src(getGlobPaths(), { since: gulp.lastRun(static) })
        .pipe(taskStart())
        .pipe(gulp.dest(getPaths.getDestPath('static')))

        // Reload on change
        .pipe(taskEnd());
}

function staticWatch () {
    return gulp.watch(getGlobPaths(), static);
}


exports.build = static;
exports.watch = staticWatch;
