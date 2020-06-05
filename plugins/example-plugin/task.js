const gulp = require('gulp');
const memoize = require('nano-memoize');

const getConfig = require('@videinfra/example-website-builder/lib/globs-helper');
const getConfig = require('@videinfra/example-website-builder/lib/get-config');
const getPaths = require('@videinfra/example-website-builder/lib/get-path');

const taskStart = require('@videinfra/example-website-builder/gulp/task-start');
const taskEnd = require('@videinfra/example-website-builder/gulp/task-end');


// Paths and files which gulp will watch and run on
// memoize for performance
const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('html');
    const extensions = getConfig.getTaskConfig('example', 'extensions');

    // Combine source paths and extensions
    return globs.generate(
        globs.paths(sourcePaths).addExtensions(extensions), // Files to watch
    );
});


function example () {
    return gulp.src(getGlobPaths(), { since: gulp.lastRun(example) })
        // Start of task, handles errors
        .pipe(taskStart())

        // Do something....

        // Output into destination folder for 'html'
        .pipe(gulp.dest(getPaths.getDestPath('html')))

        // End task, handles reloading on file change
        .pipe(taskEnd());
}

function exampleWatch () {
    return gulp.watch(getGlobPaths(), example);
}


// Available tasks are: beforeWatch, watch, afterWatch, beforeBuild, build, afterBuild
exports.build = example;
exports.watch = exampleWatch;
