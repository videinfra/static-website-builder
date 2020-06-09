#!/usr/bin/env node
const path = require('path')

const allArgs = require('minimist')(process.argv.slice(2));
const additionalArgs = allArgs._;

if (additionalArgs[0] === 'init') {
    const init = require('../init/index');
    init(additionalArgs[1]);
} else {
    const builderEntryDir = path.resolve(__dirname, '../gulpfile.js');
    const gulpModulePath = path.dirname(require.resolve('gulp'));
    const gulpBinaryFile = path.join(gulpModulePath, '/bin/gulp');

    let args = ['--gulpfile', builderEntryDir];

    if(additionalArgs.length) {
        args = args.concat(additionalArgs);
    }

    if (allArgs.config) {
        args = args.concat('--config', allArgs.config);
    }

    require('child_process').fork(gulpBinaryFile, args);
}
