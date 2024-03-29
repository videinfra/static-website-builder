const map = require('lodash/map');
const assign = require('lodash/assign');
const filter = require('lodash/filter');
const { series, parallel } = require('gulp');
const { DEFAULT_TASKS, BUILD_TASKS } = require('./task-order');
const resolveDynamicTask = require('./gulp/resolve-dynamic-task');


/**
 * Organize and order tasks
 *
 * @param {object} taskConfig Task config
 * @returns {object} Task list
 */
function generateTaskList (taskConfig) {
    const taskList = {
        'default': map(DEFAULT_TASKS, (taskName) => []),
        'build': map(BUILD_TASKS, (taskName) => []),
        'separate': {}
    };

    for (let taskName in taskConfig.tasks) {
        // Make sure task is not disabled
        if (taskConfig[taskName] !== false) {
            const functions = taskConfig.tasks[taskName];

            for (let i = 0; i < functions.length; i++) {
                const gulpTaskList = functions[i];

                // Create individual tasks, which can be run separatelly
                for (let gulpTaskName in gulpTaskList) {
                    taskList.separate[`${ taskName }-${ gulpTaskName }`] = resolveDynamicTask(gulpTaskList[gulpTaskName]);
                }

                for (let t = 0; t < DEFAULT_TASKS.length; t++) {
                    if (DEFAULT_TASKS[t] in gulpTaskList) {
                        const gulpTask = resolveDynamicTask(gulpTaskList[DEFAULT_TASKS[t]]);
                        taskList.default[t].push(gulpTask);
                    }
                    if (BUILD_TASKS[t] in gulpTaskList) {
                        const gulpTask = resolveDynamicTask(gulpTaskList[BUILD_TASKS[t]]);
                        taskList.build[t].push(gulpTask);
                    }
                }
            }
        }
    }

    taskList.default = filter(taskList.default, taskGroup => taskGroup.length);
    taskList.build = filter(taskList.build, taskGroup => taskGroup.length);

    return taskList;
}

/**
 * Generate gulp tasks with parallel and serial
 *
 * @param {object} taskConfig Task config
 * @returns {object} Gulp task list
 */
module.exports = function generateGulpTasks (taskConfig) {
    const taskList = generateTaskList(taskConfig);

    // Create gulp tasks with parallel and series
    const defaultGulpTasks = map(taskList.default, (tasks) => parallel(...tasks));
    const buildGulpTasks = map(taskList.build, (tasks) => parallel(...tasks));

    return assign({
        'default': series(...defaultGulpTasks),
        'build': series(...buildGulpTasks),
    }, taskList.separate);
}

module.exports.generateTaskList = generateTaskList;
