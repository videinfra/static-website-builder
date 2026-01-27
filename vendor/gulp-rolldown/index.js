const Transform = require('stream').Transform
const PluginError = require('plugin-error')

const PLUGIN_NAME = 'gulp-starter-rolldown'
const rolldown = require('rolldown');
const browserSync = require('browser-sync');

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

/**
 * Virtual entry plugin to generate files from each of the entries in the entry file
 *
 * @param {object} entries Entries object from the entry file
 * @returns {object} Virtual entry plugin
 */
function virtualEntryPlugin(entries) {
    const keys = Object.keys(entries);

    return {
        name: 'virtual-entry-plugin', // this name will show up in logs and errors

        resolveId: {
			order: 'post',
			handler(source) {
				if (keys.includes(source)) {
                    return source;
                }
                return null; // other ids should be handled as usual
			}
		},

        load(id) {
            if (keys.includes(id)) {
                return entries[id].map((entry) => `import '${entry}';`).join('\n');
            }
            return null; // other ids should be handled as usual
        },
    };
}

const watcherList = {};

// transformer class
class GulpRolldown extends Transform {

    _build(file, cb, inputOptions, outputOptions) {
        rolldown.build(inputOptions)
            .then((result) => {
                // Prevent gulp from outputing anything
                cb();
            })
            .catch(err => {
                process.nextTick(() => {
                    this.emit('error', new PluginError(PLUGIN_NAME, err))
                    cb()
                });
            });
    }

    _watch(file, cb, inputOptions, outputOptions) {
        const watcher = watcherList[file.path] = rolldown.watch(inputOptions);

        watcher.on('event', (event) => {
            if (event.code === 'BUNDLE_END') {
                event.result.close();

                // Reload browser
                browserSync.reload();
            }
        });

        // Prevent gulp from outputing anything
        cb();
    }

    _transform(file, encoding, cb) {
        // Empty or unavailable files, not supported
        if (file.isNull()) {
            return cb(null, file)
        }

        // Stream, not supported
        if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
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
        const fullDir = this.outputOptions.fullDir;
        const inputOptions = Object.assign({}, this.inputOptions)
        const outputOptions = Object.assign({}, this.outputOptions);

        delete(inputOptions.entries);
        delete(outputOptions.fullDir);

        // Parse entry file
        const entryContent = evalEntry(file.contents.toString());
        if (!entryContent) {
            // @TODO Couldn't read entry file, throw an error???
        }

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
        inputOptions.plugins = [
            virtualEntryPlugin(entryContent),
        ].concat(inputOptions.plugins || []);

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
module.exports = function factory(inputOptions, outputOptions) {
    const stream = new GulpRolldown({objectMode: true})

    stream.inputOptions = inputOptions
    stream.outputOptions = outputOptions

    return stream
}
