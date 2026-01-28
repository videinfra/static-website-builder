#!/usr/bin/env node
import path from 'path';
import { fileURLToPath } from 'node:url';
import minimist from 'minimist';
import { fork } from 'child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const allArgs = minimist(process.argv.slice(2));
const additionalArgs = allArgs._;

if (additionalArgs[0] === 'init') {
    import('../init/index').then(({ default: init }) => {
        init(additionalArgs[1]);
    });
} else {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const builderEntryDir = path.resolve(__dirname, '../gulpfile.js');
    const gulpModulePath = path.dirname(require.resolve('gulp'));
    const gulpBinaryFile = path.join(gulpModulePath, '/bin/gulp');

    let args = ['--gulpfile', builderEntryDir];

    if (additionalArgs.length) {
        args = args.concat(additionalArgs);
    }

    if (allArgs.config) {
        args = args.concat('--config', allArgs.config);
    }
    if (allArgs.tasks) {
        args = args.concat('--tasks', '');
    }

    fork(gulpBinaryFile, args).on('exit', function (code) {
        // Exit with error if child process exited with an error
        process.exit(code);
    });
}
