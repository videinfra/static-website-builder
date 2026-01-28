// 2025-01-20, Kaspars Zuks: added "options.data" support for variables
'use strict';

import path from 'path';
import { Transform } from 'stream';
import picocolors from 'picocolors';
import PluginError from 'plugin-error';
import replaceExtension from 'replace-ext';
import stripAnsi from 'strip-ansi';
import clonedeep from 'lodash.clonedeep';
import applySourceMap from 'vinyl-sourcemaps-apply';
import sassStingify from './sass-stringify.js';

const PLUGIN_NAME = 'gulp-sass';

const MISSING_COMPILER_MESSAGE = `
gulp-sass no longer has a default Sass compiler; please set one yourself.
Both the "sass" and "node-sass" packages are permitted.
For example, in your gulpfile:

  import * as sass from 'sass';
  import gulpSass from 'gulp-sass';
  const instance = gulpSass(sass);
`;

const transfob = (transform) => new Transform({ transform, objectMode: true });

/**
 * Handles returning the file to the stream
 */
const filePush = (file, sassObject, callback) => {
    // Build Source Maps!
    if (sassObject.map) {
        // Transform map into JSON
        const sassMap = JSON.parse(sassObject.map.toString());
        // Grab the stdout and transform it into stdin
        const sassMapFile = sassMap.file.replace(/^stdout$/, 'stdin');
        // Grab the base filename that's being worked on
        const sassFileSrc = file.relative;
        // Grab the path portion of the file that's being worked on
        const sassFileSrcPath = path.dirname(sassFileSrc);

        if (sassFileSrcPath) {
            const sourceFileIndex = sassMap.sources.indexOf(sassMapFile);
            // Prepend the path to all files in the sources array except the file that's being worked on
            sassMap.sources = sassMap.sources.map((source, index) => (index === sourceFileIndex ? source : path.join(sassFileSrcPath, source)));
        }

        // Remove 'stdin' from souces and replace with filenames!
        sassMap.sources = sassMap.sources.filter((src) => src !== 'stdin' && src);

        // Replace the map file with the original filename (but new extension)
        sassMap.file = replaceExtension(sassFileSrc, '.css');
        // Apply the map
        applySourceMap(file, sassMap);
    }

    file.contents = sassObject.css;
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
    const message = `${picocolors.underline(relativePath)}\n${error.formatted}`;

    error.messageFormatted = message;
    error.messageOriginal = error.message;
    error.message = stripAnsi(message);
    error.relativePath = relativePath;

    return callback(new PluginError(PLUGIN_NAME, error));
};

/**
 * Escape SCSS variable value for output in SCSS
 * @param {any} value Value
 * @returns {string} Escaped value
 */
const escapeSCSSVariable = (value) => {
    if (value !== '' && (value === true || value === false || !isNaN(value))) {
        return String(value);
    } else {
        // Convert to string
        return "'" + value.toString().replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
    }
};

/**
 * Main Gulp Sass function
 */

// eslint-disable-next-line arrow-body-style
const gulpSass = (options, sync) => {
    return transfob((file, encoding, callback) => {
        if (file.isNull()) {
            callback(null, file);
            return;
        }

        if (file.isStream()) {
            callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return;
        }

        if (path.basename(file.path).startsWith('_')) {
            callback();
            return;
        }

        if (!file.contents.length) {
            file.path = replaceExtension(file.path, '.css');
            callback(null, file);
            return;
        }

        const opts = clonedeep(options || {});
        opts.data = file.contents.toString();

        // Stringiyfy variables
        if (options.data) {
            opts.data = sassStingify(options.data) + opts.data;
        }

        // We set the file path here so that libsass can correctly resolve import paths
        opts.file = file.path;

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

        // Generate Source Maps if the source-map plugin is present
        if (file.sourceMap) {
            opts.sourceMap = file.path;
            opts.omitSourceMapUrl = true;
            opts.sourceMapContents = true;
        }

        if (sync !== true) {
            /**
             * Async Sass render
             */
            gulpSass.compiler.render(opts, (error, obj) => {
                if (error) {
                    handleError(error, file, callback);
                    return;
                }

                filePush(file, obj, callback);
            });
        } else {
            /**
             * Sync Sass render
             */
            try {
                filePush(file, gulpSass.compiler.renderSync(opts), callback);
            } catch (error) {
                handleError(error, file, callback);
            }
        }
    });
};

/**
 * Sync Sass render
 */
gulpSass.sync = (options) => gulpSass(options, true);

/**
 * Log errors nicely
 */
gulpSass.logError = function logError(error) {
    const message = new PluginError('sass', error.messageFormatted).toString();
    process.stderr.write(`${message}\n`);
    this.emit('end');
};

export default (compiler) => {
    if (!compiler || !compiler.render) {
        const message = new PluginError(PLUGIN_NAME, MISSING_COMPILER_MESSAGE, { showProperties: false }).toString();
        process.stderr.write(`${message}\n`);
        process.exit(1);
    }

    gulpSass.compiler = compiler;
    return gulpSass;
};
