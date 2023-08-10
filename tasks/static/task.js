const gulp = require('gulp');
const memoize = require('nano-memoize').default;

const globs = require('./../../lib/globs-helper');
const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');

const taskStart = require('../../lib/gulp/task-start');
const taskEnd = require('../../lib/gulp/task-end');
const taskBeforeDest = require('../../lib/gulp/task-before-dest');
const taskWatch = require('../../lib/gulp/task-watch');


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

        .pipe(taskBeforeDest())
        .pipe(gulp.dest(getPaths.getDestPath('static')))

        // Reload on change
        .pipe(taskEnd());
}

function staticWatch () {
    return taskWatch(getGlobPaths(), static);
}


exports.build = static;
exports.watch = staticWatch;
