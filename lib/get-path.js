const fs = require('fs');
const merge = require('./merge');
const path = require('path');
const memoize = require('nano-memoize');


/**
 * Returns builder and project specific path configurations merged
 *
 * @returns {object} Configuration
 */
const getConfig = memoize(function () {
    let pathConfig = require('../config/path-config.js');
    const builderConfigFolder = process.env.BUILDER_CONFIG_PATH || 'config';
    const projectConfigPath = getProjectPath(builderConfigFolder, 'path-config.js');

    if (fs.existsSync(projectConfigPath)) {
        pathConfig = merge({}, pathConfig, require(projectConfigPath));
    }

    return pathConfig;
});

/**
 * Returns a path relative to the project folder
 *
 * @param  {...any} paths List of paths
 * @returns {string} Path
 */
function getProjectPath (...paths) {
    return path.resolve(process.env.INIT_CWD || process.cwd(), ...paths);
};

/**
 * Returns a path relative to the builder folder
 *
 * @param  {...any} paths List of paths
 * @returns {string} Path
 */
function getBuilderPath (...paths) {
    return path.resolve(__dirname, '../', ...paths);
};

/**
 * Returns task source path or paths
 *
 * @param {string} name Task name
 * @param  {...string} paths Additional sub paths
 * @returns {string|array} Task source path or list of paths
 */
function getSourcePath (name, ...paths) {
    const pathConfig = getConfig();
    const path = pathConfig[name].src;

    if (typeof path === 'string') {
        return getProjectPath(pathConfig.src, path, ...paths);
    } else if (Array.isArray(path)) {
        return path.map((path) => getProjectPath(pathConfig.src, path, ...paths));
    } else {
        return null;
    }
}

/**
 * Returns task source paths
 *
 * @param {string} name Task name
 * @param  {...string} paths Additional sub paths
 * @returns {array} Task source paths
 */
function getSourcePaths (name, ...paths) {
    const path = getSourcePath(name, ...paths);

    if (typeof path === 'string') {
        return [path];
    } else {
        return path;
    }
}

/**
 * Returns task destination path
 *
 * @param {string} [name] Task name
 * @param  {...string} paths Additional sub paths
 * @returns {string} Task destination path
 */
function getDestPath (name, ...paths) {
    const pathConfig = getConfig();

    if (name) {
        return getProjectPath(pathConfig.dest, pathConfig[name].dest || '', ...paths);
    } else {
        return getProjectPath(pathConfig.dest);
    }
}


/**
 * Convert paths to be used in the gulp glob
 * Globals can't have any backward-slashes
 *
 * @param {array|string} path Path or list of path
 * @returns {array|string} Path or list of paths
 */
function normalizeGlob (path) {
    if (typeof path === 'string') {
        return path.replace(/\\/g, '/');
    } else if (Array.isArray(path)) {
        return path.map((path) => normalizeGlob(path));
    } else {
        return path;
    }
}

/**
 * Returns gulp task source paths
 *
 * @param {array} paths List of source paths
 * @param {string|array} extensions File extension or list of extensions
 * @returns {array} List of gulp source paths
 */
function getGlobPaths (paths, extensions) {
    const extensionsArr = typeof extensions === 'string' ? [extensions] : extensions;
    const pathsArr = Array.isArray(paths) ? paths : [paths];

    if (extensionsArr && extensionsArr.length) {
        if (extensionsArr.length > 1) {
            return normalizeGlob(pathsArr.map(path => `${ path }/**/*.{${ extensionsArr.join(',') }}`));
        } else {
            return normalizeGlob(pathsArr.map(path => `${ path }/**/*.${ extensionsArr }`));
        }
    } else {
        return normalizeGlob(pathsArr.map(path => `${ path }/**`));
    }
}


exports.getConfig = getConfig;
exports.getSourcePath = getSourcePath;
exports.getSourcePaths = getSourcePaths;
exports.getDestPath = getDestPath;
exports.getGlobPaths = getGlobPaths;
exports.getProjectPath = getProjectPath;
exports.getBuilderPath = getBuilderPath;
exports.normalizeGlob = normalizeGlob;
