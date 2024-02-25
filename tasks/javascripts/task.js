const gulp = require('gulp');
const { parallel } = require('gulp');
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
const dynamicTask = require('../../lib/gulp/dynamic-task');

const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('javascripts');
    const extensions = getConfig.getTaskConfig('javascripts', '0', 'webpack', 'resolve', 'extensions');
    const ignore = getConfig.getTaskConfig('javascripts', '0', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(),          // List of files which to ignore
    );
});


function javascripts (watch) {
    const configs = getConfig.getTaskConfig('javascripts');

    // Configs is an array, for each of the entry files separate config is created
    const tasks = configs.map(function (config, index) {
        // Gulp task function
        const fn = function () {
            return gulp.src(getGlobPaths())
                .pipe(taskStart())

                .pipe(gulpWebpack(
                    merge(config.webpack, {'watch': watch === true}),
                    webpack
                ))

                .pipe(taskBeforeDest())
                .pipe(gulp.dest(getPaths.getDestPath('javascripts')))

                // Reload on change
                .pipe(taskEnd());
        };

        // Set name of the gulp task function, currently it doesn't have a name yet
        // This is needed so that name appears in terminal when running build
        let name = 'javascripts' + (watch ? 'Watch' : '');

        if (configs.length > 1) {
            let entryFileName = config.entryList.name.replace('.json', '').replace('.js', '');
            name += entryFileName[0].toUpperCase() + entryFileName.slice(1);
        }

        Object.defineProperty(fn, 'name', { value: name });

        return fn;
    });

    return parallel(...tasks);
}

function javascriptsWatch () {
    // webpack watch is used instead of gulp watch
    return javascripts(true);
}

// Dynamic task will be executed when config is ready and must return gulp tasks
exports.build = dynamicTask(javascripts);
exports.watch = dynamicTask(javascriptsWatch);
