import { Transform } from 'stream';
import PluginError from 'plugin-error';

import { watch, build } from 'rolldown';
import browserSync from 'browser-sync';

import virtualEntryPlugin from './plugin-virtual-entry.js';
import rawPlugin from './plugin-raw.js';

const PLUGIN_NAME = 'gulp-starter-rolldown';

/**
 * Evaluate entry file
 *
 * @param {string} code Entry file code
 * @returns {object} Entry file object
 */
function evalEntry(code) {
    const fullCode = `let _return = {};
    ${code.replace(/\bexport\b[\s\t\r\n]*([^\s\t]+)/g, '_return.$1 =')}
    return _return;`;

    const result = new Function(fullCode)();
    if (result.default) {
        Object.assign(result, result.default);
        delete result.default;
    }

    return result;
}

const watcherList = {};

// transformer class
class GulpRolldown extends Transform {
    _build(file, cb, inputOptions, outputOptions) {
        build(inputOptions)
            .then((result) => {
                // Prevent gulp from outputing anything
                cb();
            })
            .catch((err) => {
                process.nextTick(() => {
                    this.emit('error', new PluginError(PLUGIN_NAME, err));
                    cb();
                });
            });
    }

    _watch(file, cb, inputOptions, outputOptions) {
        const watcher = (watcherList[file.path] = watch(inputOptions));

        watcher.on('event', (event) => {
            if (event.code === 'BUNDLE_END') {
                event.result.close();

                // Reload browser
                browserSync.reload();
            } else if (event.code === 'ERROR') {
                this.emit('error', new PluginError(PLUGIN_NAME, event.error));
            }
        });

        // Prevent gulp from outputing anything
        cb();
    }

    _transform(file, encoding, cb) {
        // Empty or unavailable files, not supported
        if (file.isNull()) {
            return cb(null, file);
        }

        // Stream, not supported
        if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }

        const entries = this.inputOptions.entries;

        if (!file.path.endsWith(entries.name)) {
            // Not an entry file, skip
            return cb();
        }

        // Remove old watcher if exists
        if (watcherList[file.path]) {
            watcherList[file.path].close();
            delete watcherList[file.path];
        }

        // Transform options
        const inputOptions = Object.assign({}, this.inputOptions);
        const outputOptions = Object.assign({}, this.outputOptions);

        delete inputOptions.entries;

        // Parse entry file
        const entryContent = evalEntry(file.contents.toString());

        // Add code splitting with shared
        if (entries.shared) {
            outputOptions.codeSplitting = Object.assign({}, outputOptions.codeSplitting || {}, {
                groups: [].concat(outputOptions.codeSplitting?.groups || [], [
                    {
                        name: entries.shared,
                        minShareCount: 3,
                    },
                ]),
            });
        }

        // Don't output hash for rolldown runtime and shared chunks
        outputOptions.chunkFileNames = (info) => {
            if ((entries.shared && info.name === entries.shared) || info.name === 'rolldown-runtime') {
                return '[name].js';
            } else {
                return '[name]-[hash].js';
            }
        };

        // Set input files
        inputOptions.input = Object.keys(entryContent);
        inputOptions.plugins = [rawPlugin(), virtualEntryPlugin(entryContent)].concat(inputOptions.plugins || []);

        // Set full paths when running watch or build
        inputOptions.output = outputOptions;

        if (global.production) {
            this._build(file, cb, inputOptions);
        } else {
            this._watch(file, cb, inputOptions);
        }
    }
}

/**
 * Factory
 *
 * @param {object} inputOptions
 * @param {object} outputOptions
 * @returns
 */
export default function factory(inputOptions, outputOptions) {
    const stream = new GulpRolldown({ objectMode: true });

    stream.inputOptions = inputOptions;
    stream.outputOptions = outputOptions;

    return stream;
}
