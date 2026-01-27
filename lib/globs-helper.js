const path = require("path");
const flatten = require("lodash/flatten");
const map = require("lodash/map");
const filter = require("lodash/filter");

const REGEX_DOT_PREFIX = /^\.+/;
const REGEX_WINDOWS_BACKSLASH = /\\/g;

class GlobObject {
    constructor() {
        this.hadEmptyPaths = false;
        this.isIgnore = false;
        this.isAllFiles = false;
        this.hasExtensions = false;
        this.extensions = [];
        this.pathsArr = [];
        this.pathsArrRaw = [];
    }

    paths(paths) {
        const pathsArr = Array.isArray(paths)
            ? paths
            : typeof paths === "string"
              ? [paths]
              : [];

        if (pathsArr.length) {
            if (this.pathsArr.length) {
                this.map((basePath) => {
                    return pathsArr.map((subPath) => {
                        // If subpath starts with specia character "!" then prepend that to the begining of full paths
                        const negativePath = subPath[0] === "!" ? "!" : "";
                        const subPathNormalized = negativePath
                            ? subPath.substr(1)
                            : subPath;

                        return (
                            negativePath +
                            path.join(basePath, subPathNormalized)
                        );
                    });
                });

                this.mapRaw((basePath) => {
                    return pathsArr.map((subPath) => {
                        // If subpath starts with specia character "!" then prepend that to the begining of full paths
                        const negativePath = subPath[0] === "!" ? "!" : "";
                        const subPathNormalized = negativePath
                            ? subPath.substr(1)
                            : subPath;

                        if (negativePath) {
                            this.isIgnore = true;
                        }

                        return (
                            negativePath +
                            path.join(basePath, subPathNormalized)
                        );
                    });
                });
            } else {
                this.pathsArr = pathsArr;
                this.pathsArrRaw = pathsArr;
            }
        } else {
            this.hadEmptyPaths = true;
        }

        return this;
    }

    /**
     * Adds extensions to the paths
     *
     * @param {string|array} extensions An extension or list of extensions
     * @returns {object} GlobObject
     */
    filesWithExtensions(extensions) {
        const extensionsArr =
            typeof extensions === "string" ? [extensions] : extensions;

        if (extensionsArr && extensionsArr.length) {
            let extensionString = "";

            // Remove dot from the extension name
            let extensionsArrNormalized = map(extensionsArr, (extension) =>
                extension.replace(REGEX_DOT_PREFIX, ""),
            );

            if (extensionsArrNormalized.length > 1) {
                extensionString = `/**/*.{${extensionsArrNormalized.join(",")}}`;
            } else {
                extensionString = `/**/*.${extensionsArrNormalized}`;
            }

            this.extensions = this.extensions.concat(extensionsArr);
            this.hasExtensions = !!this.extensions.length > 0;
            return this.map((path) => `${path}${extensionString}`);
        } else {
            return this;
        }
    }

    /**
     * Add a wildcard to select all files
     *
     * @returns {object} GlobObject
     */
    allFiles() {
        this.isAllFiles = true;
        return this.map((path) => `${path}/**`);
    }

    /**
     * Adds all paths to the ignore list
     *
     * @returns {object} GlobObject
     */
    ignore() {
        this.isIgnore = true;
        return this.map((path) => `!${path}`);
    }

    /**
     * Itterates through all paths
     *
     * @param {function} fn Itteratee function
     * @returns {object} GlobObject
     */
    map(fn) {
        this.pathsArr = filter(
            flatten(map(this.pathsArr, fn)),
            (path) => !!path,
        );
        return this;
    }

    /**
     * Itterates through all paths
     *
     * @param {function} fn Itteratee function
     * @returns {object} GlobObject
     */
    mapRaw(fn) {
        this.pathsArrRaw = filter(
            flatten(map(this.pathsArrRaw, fn)),
            (path) => !!path,
        );
        return this;
    }

    /**
     * Converts paths to an array of normalized glob paths
     *
     * @returns {array} Array of glob paths
     */
    toArray() {
        if (this.hadEmptyPaths && this.isIgnore) {
            // Since we exclude files / paths, don't return anything if path list was empty
            return [];
        } else {
            return map(this.pathsArr, (path) => {
                return path.replace(REGEX_WINDOWS_BACKSLASH, "/");
            });
        }
    }

    /**
     * Converts paths to an array of normalized glob paths
     *
     * @returns {array} Array of glob paths
     */
    toArrayRaw() {
        if (this.hadEmptyPaths && this.isIgnore) {
            // Since we exclude files / paths, don't return anything if path list was empty
            return [];
        } else {
            return map(this.pathsArrRaw, (path) => {
                return path.replace(REGEX_WINDOWS_BACKSLASH, "/");
            });
        }
    }

    /**
     * Alias for toArray
     *
     * @returns {array} Array of glob paths
     */
    generate(forChokidar = false) {
        if (forChokidar) {
            const paths = this.toArrayRaw().map((path) =>
                this.isAllFiles || this.hasExtensions ? path + "/." : path,
            );

            if (this.hadEmptyPaths && this.isIgnore) {
                return {
                    paths: [],
                    ignore: [],
                };
            } else if (this.isIgnore) {
                return {
                    paths: paths,
                    ignore: chokidarFilterIgnorePaths(this.toArrayRaw()),
                };
            } else if (this.hasExtensions) {
                return {
                    paths: paths,
                    ignore: [chokidarFilterOnlyExtensions(this.extensions)],
                };
            } else {
                return {
                    paths: paths,
                    ignore: [],
                };
            }
        } else {
            return this.toArray();
        }
    }
}

function paths(paths) {
    return new GlobObject().paths(paths);
}

function generate(...globs) {
    const isLastArgBoolean = typeof globs[globs.length - 1] === "boolean";
    const forChokidar = isLastArgBoolean ? globs.pop() : false;

    if (forChokidar) {
        const results = map(flatten(globs), (glob) => glob.generate(true));

        return {
            paths: flatten(results.map((result) => result.paths)),
            ignore: flatten(results.map((result) => result.ignore)),
        };
    } else {
        return flatten(map(flatten(globs), (glob) => glob.generate(false)));
    }
}

/**
 * Create chokidar filter function to only allow certain extensions
 * @param {array} extensions
 * @returns {function}
 */
function chokidarFilterOnlyExtensions(extensions) {
    return function (path, _stats) {
        return !extensions.some((extension) => path.endsWith(`.${extension}`));
    };
}

/**
 * Create chokidar filter function to ignore certain paths
 * @param {array} ignorePaths
 * @returns {function}
 */
function chokidarFilterIgnorePaths(ignorePaths) {
    return function (path, _stats) {
        return ignorePaths.some((ignorePath) => path.startsWith(ignorePath));
    };
}

module.exports = {
    generate,
    paths,
};
