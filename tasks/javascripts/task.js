const gulp = require('gulp');
const { parallel } = require('gulp');
const { nanomemoize } = require('nano-memoize');
const gulpRolldown = require('../../vendor/gulp-rolldown/index.js')

const merge = require('../../lib/merge');
const globs = require('./../../lib/globs-helper');
const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');

const taskStart = require('../../lib/gulp/task-start');
const taskEnd = require('../../lib/gulp/task-end');
const taskBeforeDest = require('../../lib/gulp/task-before-dest');
const taskWatch = require('../../lib/gulp/task-watch');
const dynamicTask = require('../../lib/gulp/dynamic-task');

const getGlobPaths = nanomemoize(function () {
    const sourcePaths = getPaths.getSourcePaths('javascripts');
    const extensions = getConfig.getTaskConfig('javascripts', '0', 'rolldown', 'resolve', 'extensions');

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
    );
});

const getWatchGlobPaths = nanomemoize(function () {
    const sourcePaths = getPaths.getSourcePaths('javascripts');
    const entries = getConfig.getTaskConfig('javascripts', '0', 'entryList');

    // Watch only or entry files; rolldown will watch all other files
    const entryFileNamesNames = entries.map((entry) => entry.name);

    return globs.generate(
        globs.paths(sourcePaths).paths(entryFileNamesNames),
        true,
    );
});

function javascripts (watch) {
    const configs = getConfig.getTaskConfig('javascripts');

    // Configs is an array, for each of the entry files separate config is created
    const tasks = configs.map(function (config, index) {
        // Gulp task function
        const fn = function () {
            const rolldownConfig = merge(config.rolldown);

            return gulp.src(getGlobPaths())
                .pipe(taskStart())

                .pipe(gulpRolldown(
                    rolldownConfig,
                    rolldownConfig.output,
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
            let entryFileName = config.rolldown.entries.name.replace('.json', '').replace('.js', '');
            name += entryFileName[0].toUpperCase() + entryFileName.slice(1);
        }

        Object.defineProperty(fn, 'name', { value: name });

        return fn;
    });

    return parallel(...tasks);
}

function javascriptsWatch () {
    return function javascriptsWatch () {
        // We need to watch only entry files, all other files are being watched by rolldown
        return taskWatch(getWatchGlobPaths(), javascripts(true), true);
    }
}

// Dynamic task will be executed when config is ready and must return gulp tasks
exports.build = dynamicTask(javascripts);
exports.watch = dynamicTask(javascriptsWatch);
