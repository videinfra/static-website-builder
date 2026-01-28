import gulp from 'gulp';
import { parallel } from 'gulp';
import nanomemoize from 'nano-memoize';
import gulpRolldown from '../../vendor/gulp-rolldown/index.js';

import merge from '../../lib/merge.js';
import globs from './../../lib/globs-helper.js';
import { getSourcePaths, getDestPath } from './../../lib/get-path.js';
import { getTaskConfig } from './../../lib/get-config.js';

import taskStart from '../../lib/gulp/task-start.js';
import taskEnd from '../../lib/gulp/task-end.js';
import taskBeforeDest from '../../lib/gulp/task-before-dest.js';
import taskWatch from '../../lib/gulp/task-watch.js';
import dynamicTask from '../../lib/gulp/dynamic-task.js';

const getGlobPaths = nanomemoize.nanomemoize(function () {
    const sourcePaths = getSourcePaths('javascripts');
    const extensions = getTaskConfig('javascripts', '0', 'rolldown', 'resolve', 'extensions');

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
    );
});

const getWatchGlobPaths = nanomemoize.nanomemoize(function () {
    const sourcePaths = getSourcePaths('javascripts');
    const entries = getTaskConfig('javascripts', '0', 'entryList');

    // Watch only or entry files; rolldown will watch all other files
    const entryFileNamesNames = entries.map((entry) => entry.name);

    return globs.generate(globs.paths(sourcePaths).paths(entryFileNamesNames), true);
});

function javascripts(watch) {
    const configs = getTaskConfig('javascripts');

    // Configs is an array, for each of the entry files separate config is created
    const tasks = configs.map(function (config, index) {
        // Gulp task function
        const fn = function () {
            const rolldownConfig = merge(config.rolldown);

            return (
                gulp
                    .src(getGlobPaths())
                    .pipe(taskStart())

                    .pipe(gulpRolldown(rolldownConfig, rolldownConfig.output))

                    .pipe(taskBeforeDest())
                    .pipe(gulp.dest(getDestPath('javascripts')))

                    // Reload on change
                    .pipe(taskEnd())
            );
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

function javascriptsWatch() {
    return function javascriptsWatch() {
        // We need to watch only entry files, all other files are being watched by rolldown
        return taskWatch(getWatchGlobPaths(), javascripts(true), true);
    };
}

// Dynamic task will be executed when config is ready and must return gulp tasks
export const build = dynamicTask(javascripts);
export const watch = dynamicTask(javascriptsWatch);
