import path from 'path';
import { fileURLToPath } from 'node:url';
import nanomemoize from 'nano-memoize';
import { getConfig } from './get-config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Returns builder and project specific path configurations merged
 *
 * @returns {object} Configuration
 */

export const getPathConfig = nanomemoize.nanomemoize(function () {
    return getConfig().paths;
});

/**
 * Returns a path relative to the project folder
 *
 * @param  {...any} paths List of paths
 * @returns {string} Path
 */
export function getProjectPath(...paths) {
    return path.resolve(process.env.INIT_CWD || process.cwd(), ...paths);
}

/**
 * Returns a path relative to the builder folder
 *
 * @param  {...any} paths List of paths
 * @returns {string} Path
 */
export function getBuilderPath(...paths) {
    return path.resolve(__dirname, '../', ...paths);
}

/**
 * Returns task source path or paths
 *
 * @param {string} name Task name
 * @param  {...string} paths Additional sub paths
 * @returns {string|array} Task source path or list of paths
 */
export function getSourcePath(name, ...paths) {
    const pathConfig = getPathConfig();
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
export function getSourcePaths(name, ...paths) {
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
export function getDestPath(name, ...paths) {
    const pathConfig = getPathConfig();

    if (name) {
        return getProjectPath(pathConfig.dest, pathConfig[name].dest || '', ...paths);
    } else {
        return getProjectPath(pathConfig.dest);
    }
}

/**
 * Returns public path
 *
 * @param {string} [name] Task name
 * @returns {string} Task public path
 */
export function getPublicPath(name) {
    const destFullPath = getDestPath(name);
    const destPath = getDestPath();
    return destFullPath.replace(destPath, '') + '/';
}
