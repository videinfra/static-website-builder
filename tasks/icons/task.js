const gulp = require('gulp');
const gulpif = require('gulp-if');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const memoize = require('nano-memoize');

const globs = require('./../../lib/globs-helper');
const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');

const taskStart = require('../../lib/gulp/task-start');
const taskEnd = require('../../lib/gulp/task-end');
const taskBeforeDest = require('../../lib/gulp/task-before-dest');
const taskWatch = require('../../lib/gulp/task-watch');


const getWatchGlobPaths = function (forChokidar = false) {
    const sourcePaths = getPaths.getSourcePaths('icons');
    const extensions = getConfig.getTaskConfig('icons', 'extensions');
    const ignore = getConfig.getTaskConfig('icons', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(),          // List of files which to ignore
        forChokidar,
    );
};
const getGlobPaths = memoize(function () {
    return getWatchGlobPaths(false);
});


function icons () {
    return gulp
        .src(getGlobPaths())
        .pipe(taskStart())

        // Minify SVG
        .pipe(gulpif(!!getConfig.getTaskConfig('icons', 'svgmin'), svgmin(getConfig.getTaskConfig('icons', 'svgmin'))))

        // Create sprite
        .pipe(svgstore(getConfig.getTaskConfig('icons', 'svgstore')))

        .pipe(taskBeforeDest())
        .pipe(gulp.dest(getPaths.getDestPath('icons')))

        // Reload on change
        .pipe(taskEnd());
}

function iconsWatch () {
    return taskWatch(getWatchGlobPaths(true), icons);
}


exports.build = icons;
exports.watch = iconsWatch;
