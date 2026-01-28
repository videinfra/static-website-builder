import pick  from 'lodash/pick.js';
import { generateTaskList }  from '../lib/generate-gulp-tasks.js';
import { BEFORE_BUILD, BUILD, AFTER_BUILD, BEFORE_WATCH, WATCH }  from '../lib/task-order.js';

test('Tasks are organized correctly', () => {
    const beforeBuildA = () => {};
    const beforeBuildB = () => {};
    const buildA = () => {};
    const buildB = () => {};
    const beforeWatchA = () => {};
    const watchA = () => {};
    const afterBuildA = () => {};

    const taskConfig = {'tasks': {
        'task1': [
            {[BEFORE_BUILD]: beforeBuildA},
            {[BEFORE_BUILD]: beforeBuildB},
        ],
        'task2': [
            {[BUILD]: buildA, [WATCH]: watchA}
        ],
        'task3': [
            {[BUILD]: buildB, [AFTER_BUILD]: afterBuildA}
        ],
        'task4': [
            {[BEFORE_WATCH]: beforeWatchA}
        ],
    }};

    expect(pick(generateTaskList(taskConfig), ['default', 'watch', 'build'])).toEqual({
        default: [
            [beforeBuildA, beforeBuildB],
            [buildA, buildB],
            [beforeWatchA],
            [watchA],
        ],
        watch: [
            [beforeBuildA, beforeBuildB],
            [buildA, buildB],
            [beforeWatchA],
            [watchA],
        ],
        build: [
            [beforeBuildA, beforeBuildB],
            [buildA, buildB],
            [afterBuildA],
        ]
    });
});

test('Skipping tasks doesn\'t genearate empty arrays', () => {
    const beforeBuildA = () => {};
    const beforeBuildB = () => {};
    const buildA = () => {};
    const buildB = () => {};
    const afterBuildA = () => {};

    const taskConfig = {'tasks': {
        'task1': [
            {[BEFORE_BUILD]: beforeBuildA},
            {[BEFORE_BUILD]: beforeBuildB},
        ],
        'task2': [
            {[BUILD]: buildA}
        ],
        'task3': [
            {[BUILD]: buildB, [AFTER_BUILD]: afterBuildA}
        ],
    }};

    const taskList = pick(generateTaskList(taskConfig), ['default', 'watch', 'build']);

    for (let taskName in taskList) {
        taskList[taskName].forEach((parallel) => {
            expect(parallel.length).not.toBe(0);
        });
    }
});
