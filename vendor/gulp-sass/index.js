// 2025-01-20, Kaspars Zuks: added "options.data" support for variables
// 2026-03-04, Kaspars Zuks: updated to use "compileString" instead of "renderSync"
// 2026-03-04, Kaspars Zuks: removed async version
'use strict';

import path from 'path';
import { Transform } from 'stream';
import chalk from 'chalk';
import PluginError from 'plugin-error';
import replaceExtension from 'replace-ext';
import stripAnsi from 'strip-ansi';
import cloneDeep from 'lodash/cloneDeep.js';
import sassStingify from './sass-stringify.js';

const PLUGIN_NAME = 'gulp-sass';

const transfob = (transform) => new Transform({ transform, objectMode: true });

/**
 * Handles returning the file to the stream
 */
const filePush = (file, css, callback) => {
    file.contents = css;
    file.path = replaceExtension(file.path, '.css');

    if (file.stat) {
        file.stat.atime = file.stat.mtime = file.stat.ctime = new Date();
    }

    callback(null, file);
};

/**
 * Handles error message
 */
const handleError = (error, file, callback) => {
    const filePath = (error.file === 'stdin' ? file.path : error.file) || file.path;
    const relativePath = path.relative(process.cwd(), filePath);
    const message = `${chalk.underline(relativePath)}\n${error.formatted}`;

    error.messageFormatted = message;
    error.messageOriginal = error.message;
    error.message = stripAnsi(message);
    error.relativePath = relativePath;

    return callback(new PluginError(PLUGIN_NAME, error));
};

/**
 * Main Gulp Sass function
 */

// eslint-disable-next-line arrow-body-style
const gulpSass = (options) => {
    return transfob((file, encoding, callback) => {
        if (file.isStream()) {
            callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }

        if (path.basename(file.path).startsWith('_')) {
            callback();
            return;
        }

        if (file.contents && !file.contents.length) {
            file.path = replaceExtension(file.path, '.css');
            callback(null, file);
            return;
        }

        const opts = cloneDeep(options || {});
        let source = file.contents.toString();

        // Stringiyfy variables
        if (opts.data) {
            source = sassStingify(opts.data) + source;
            delete(opts.data);
        }

        // Ensure `indentedSyntax` is true if a `.sass` file
        if (path.extname(file.path) === '.sass') {
            opts.indentedSyntax = true;
        }

        // Ensure file's parent directory in the include path
        if (opts.includePaths) {
            if (typeof opts.includePaths === 'string') {
                opts.includePaths = [opts.includePaths];
            }
        } else {
            opts.includePaths = [];
        }

        opts.includePaths.unshift(path.dirname(file.path));

        // Rename `includePaths` to `loadPaths`
        opts.loadPaths = opts.includePaths;
        delete(opts.includePaths);

        try {
            const result = gulpSass.compiler.compileString(source, opts);
            filePush(file, Buffer.from(result.css, 'utf8'), callback);
        } catch (error) {
            handleError(error, file, callback);
        }
    });
};

/**
 * Log errors nicely
 */
gulpSass.logError = function logError(error) {
    const message = new PluginError('sass', error.messageFormatted || error.message).toString();
    process.stderr.write(`${message}\n`);
    this.emit('end');
};

gulpSass.dispose = function () {
    if (gulpSass.compiler.dispose) {
        gulpSass.compiler.dispose();
    }
}

export default (compiler) => {
    gulpSass.compiler = compiler.initCompiler();
    return gulpSass;
};
