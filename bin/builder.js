#!/usr/bin/env node
const path = require('path')

const additionalArgs = require('minimist')(process.argv.slice(2))._;

if (additionalArgs[0] === 'init') {
    require('../init/index');
} else {
    const builderEntryDir = path.resolve(__dirname, '../gulpfile.js');
    const gulpModulePath = path.dirname(require.resolve('gulp'));
    const gulpBinaryFile = path.join(gulpModulePath, '/bin/gulp');

    let args = ['--gulpfile', builderEntryDir];

    if(additionalArgs.length) {
        args = args.concat(additionalArgs);
    }

    require('child_process').fork(gulpBinaryFile, args);
}
