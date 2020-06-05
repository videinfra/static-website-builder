const gulp = require('gulp');
const memoize = require('nano-memoize');

const globs = require('./../../lib/globs-helper');
const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');

const taskStart = require('../../gulp/task-start');
const taskEnd = require('../../gulp/task-end');


const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('fonts');
    const extensions = getConfig.getTaskConfig('fonts', 'extensions');
    const ignore = getConfig.getTaskConfig('fonts', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).withExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(), // List of files which to ignore
    );
});


function fonts () {
    return gulp
        .src(getGlobPaths(), { since: gulp.lastRun(fonts) })
        .pipe(taskStart())

        .pipe(gulp.dest(getPaths.getDestPath('fonts')))

        // Reload on change
        .pipe(taskEnd());
}

function fontsWatch () {
    return gulp.watch(getGlobPaths(), fonts);
}


exports.build = fonts;
exports.watch = fontsWatch;
