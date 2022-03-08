const path = require('path');
const flatten = require('lodash/flatten');
const map = require('lodash/map');
const filter = require('lodash/filter');

const REGEX_DOT_PREFIX = /^\.+/;
const REGEX_WINDOWS_BACKSLASH = /\\/g;


class GlobObject {
    constructor () {
        this.hadEmptyPaths = false;
        this.isIgnore = false;
        this.hasExtensions = false;
        this.pathsArr = [];
    }

    paths (paths) {
        const pathsArr = Array.isArray(paths) ? paths : (typeof paths === 'string' ? [paths] : []);

        if (pathsArr.length) {
            if (this.pathsArr.length) {
                this.map((basePath) => {
                    return pathsArr.map((subPath) => {
                        // If subpath starts with specia character "!" then prepend that to the begining of full paths
                        const negativePath = subPath[0] === '!' ? '!' : '';
                        const subPathNormalized = negativePath ? subPath.substr(1) : subPath;
                        return negativePath + path.join(basePath, subPathNormalized);
                    });
                });
            } else {
                this.pathsArr = pathsArr;
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
    filesWithExtensions (extensions) {
        const extensionsArr = typeof extensions === 'string' ? [extensions] : extensions;

        if (extensionsArr && extensionsArr.length) {
            let extensionString = '';

            // Remove dot from the extension name
            let extensionsArrNormalized = map(extensionsArr, (extension) => extension.replace(REGEX_DOT_PREFIX, ''));

            if (extensionsArrNormalized.length > 1) {
                extensionString = `/**/*.{${ extensionsArrNormalized.join(',') }}`;
            } else {
                extensionString = `/**/*.${ extensionsArrNormalized }`;
            }

            this.hasExtensions = true;
            return this.map((path) => `${ path }${ extensionString }`);
        } else {
            return this;
        }
    }

    /**
     * Add a wildcard to select all files
     *
     * @returns {object} GlobObject
     */
    allFiles () {
        return this.map((path) => `${ path }/**`);
    }

    /**
     * Adds all paths to the ignore list
     *
     * @returns {object} GlobObject
     */
    ignore () {
        this.isIgnore = true;
        return this.map((path) => `!${ path }`);
    }

    /**
     * Itterates through all paths
     *
     * @param {function} fn Itteratee function
     * @returns {object} GlobObject
     */
    map (fn) {
        this.pathsArr = filter(flatten(map(this.pathsArr, fn)), (path) => !!path);
        return this;
    }

    /**
     * Converts paths to an array of normalized glob paths
     *
     * @returns {array} Array of glob paths
     */
    toArray () {
        if (this.hadEmptyPaths && this.isIgnore) {
            // Since we exclude files / paths, don't return anything if path list was empty
            return [];
        } else {
            return map(this.pathsArr, (path) => {
                return path.replace(REGEX_WINDOWS_BACKSLASH, '/');
            });
        }
    }

    /**
     * Alias for toArray
     *
     * @returns {array} Array of glob paths
     */
    generate () {
        return this.toArray();
    }
}

function paths (paths) {
    return (new GlobObject()).paths(paths);
}

function generate (...globs) {
    return flatten(map(flatten(globs), (glob) => glob.toArray()));
}

module.exports = {
    generate,
    paths,
};
