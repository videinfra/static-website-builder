const gulp = require('gulp');
const memoize = require('nano-memoize');

const globs = require('@videinfra/example-website-builder/lib/globs-helper');
const getConfig = require('@videinfra/example-website-builder/lib/get-config');
const getPaths = require('@videinfra/example-website-builder/lib/get-path');

const taskStart = require('@videinfra/example-website-builder/lib/gulp/task-start');
const taskEnd = require('@videinfra/example-website-builder/lib/gulp/task-end');


// Paths and files which gulp will watch and run on
// Using memoize to cache the result, for performance
const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('example');
    const extensions = getConfig.getTaskConfig('example', 'extensions');
    const ignore = getConfig.getTaskConfig('example', 'ignore');

    // Combine source paths and extensions
    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(),          // Exclude files and folders from being processed
    );
});


function example () {
    return gulp.src(getGlobPaths(), { since: gulp.lastRun(example) })
        // Start of task, handles errors
        .pipe(taskStart())

        // Do something....

        // Output into destination folder for 'example'
        .pipe(gulp.dest(getPaths.getDestPath('example')))

        // End task, handles reloading on file change
        .pipe(taskEnd());
}

function exampleWatch () {
    return gulp.watch(getGlobPaths(), example);
}


// Available tasks are: beforeWatch, watch, beforeBuild, build, afterBuild
// Execution order for development is: beforeBuild -> build-> beforeWatch -> watch
// Execution order for production is: beforeBuild -> build-> afterBuild
exports.build = example;
exports.watch = exampleWatch;
