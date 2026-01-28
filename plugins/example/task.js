import gulp  from 'gulp';
import { nanomemoize }  from 'nano-memoize';

import globs  from '@videinfra/example-website-builder/lib/globs-helper.js';
import { getTaskConfig } from '@videinfra/example-website-builder/lib/get-config.js';
import getPaths  from '@videinfra/example-website-builder/lib/get-path.js';

import taskStart  from '@videinfra/example-website-builder/lib/gulp/task-start.js';
import taskEnd  from '@videinfra/example-website-builder/lib/gulp/task-end.js';
import taskWatch  from '@videinfra/example-website-builder/lib/gulp/task-watch.js';


// Paths and files which gulp will watch and run on
// Using memoize to cache the result, for performance
const getWatchGlobPaths = function (forChokidar = false) {
    const sourcePaths = getPaths.getSourcePaths('example');
    const extensions = getTaskConfig('example', 'extensions');
    const ignore = getTaskConfig('example', 'ignore');

    // Combine source paths and extensions
    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(),          // Exclude files and folders from being processed
    );
};
const getGlobPaths = nanomemoize.nanomemoize(function () {
    return getWatchGlobPaths(false);
});


function example () {
    return gulp.src(getGlobPaths(), { since: gulp.lastRun(example) })
        // Start of task, handles errors
        .pipe(taskStart())

        // Do something....

        // Output into destination folder for 'example'
        .pipe(taskBeforeDest())
        .pipe(gulp.dest(getPaths.getDestPath('example')))

        // End task, handles reloading on file change
        .pipe(taskEnd());
}

function exampleWatch () {
    return taskWatch(getWatchGlobPaths(true), example);
}


// Available tasks are: beforeWatch, watch, beforeBuild, build, afterBuild
// Execution order for development is: beforeBuild -> build-> beforeWatch -> watch
// Execution order for production is: beforeBuild -> build-> afterBuild
export const build = example;
export const watch = exampleWatch;
