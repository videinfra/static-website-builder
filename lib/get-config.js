import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

import { getProjectPath } from './get-path.js';
import runPreprocess from './run-preprocess.js';
import merge from './merge.js';
import logError from './log-error.js';

import each from 'lodash/each.js';
import omit from 'lodash/omit.js';
import isPlainObject from 'lodash/isPlainObject.js';
import isArray from 'lodash/isArray.js';
import reduce from 'lodash/reduce.js';
import get from 'lodash/get.js';
import { Module } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Returns builder and project specific task and plugin configurations combined
 * Configuration is preprocessed
 *
 * @returns {object} Task configurations
 */

let taskConfig = null;

/**
 * Load and process config files
 *
 * @param {string} builderConfigFile Builder config file path
 * @returns {object} Task configurations
 */
export async function getConfigAsync(builderConfigFile) {
    if (!taskConfig) {
        // Load all task configs
        taskConfig = itterateConfig(await loadConfig(), mergeConfigMode);

        // 1. First load project specific config.js
        const projectConfigPath = getProjectPath(builderConfigFile);
        let projectTaskConfig = {};
        let hasProjectConfigFile = true;

        try {
            fs.accessSync(projectConfigPath);
        } catch (err) {
            logError({ plugin: 'static-website-builder', message: `Couldn't find configuration file "${projectConfigPath}"` });
            hasProjectConfigFile = false;
        }

        if (hasProjectConfigFile) {
            await import(projectConfigPath).then((config) => {
                projectTaskConfig = itterateConfig(config, mergeConfigMode);
            });
        }

        // 2. Marge plugins into the config, each plugin is just a config
        const plugins = (taskConfig.plugins || []).concat(projectTaskConfig.plugins || []);
        if (plugins) {
            taskConfig.plugins = null;
            projectTaskConfig.plugins = null;

            each(plugins, (plugin) => {
                taskConfig = merge(taskConfig, itterateConfig(plugin, mergeConfigMode));
            });
        }

        // 3. Only after plugins has been executed, merge project specific config.js into main config
        if (projectTaskConfig) {
            taskConfig = merge(taskConfig, projectTaskConfig);
        }

        // 4. Preprocess
        taskConfig = runPreprocess(taskConfig);
    }

    return taskConfig;
}

/**
 * Returns loaded task config
 *
 * @returns {object} Task configurations
 */
export function getConfig() {
    if (!taskConfig) {
        throw new Error('Task config not loaded yet');
    }

    return taskConfig;
}

/**
 * Returns task sub-config by path
 *
 * @param  {...string} path Path to the sub-config
 * @returns {any} Task sub-config
 */
export function getTaskConfig(...path) {
    return get(getConfig(), path, null);
}

/**
 * Itterate over each config property and call function on
 * each object or array
 *
 * @param {*} object
 * @param {*} fn
 * @protected
 */
function itterateConfig(config, fn) {
    if (config === false) return false;
    const base = isPlainObject(config) ? {} : [];

    return reduce(
        config,
        (object, value, key) => {
            // Detect ES modules and extract 'default' and other properties
            if (value && Object.prototype.toString.call(value) === '[object Module]') {
                const module = value;

                if ('default' in module) {
                    value = module.default;
                    value.default = module.default;
                } else {
                    value = {};
                }

                for (let key in module) {
                    if (key !== 'default') {
                        value[key] = module[key];
                    }
                }
            }

            if (isPlainObject(value)) {
                object[key] = itterateConfig(fn(value), fn);
            } else if (isArray(value)) {
                object[key] = itterateConfig(value, fn);
            } else {
                object[key] = value;
            }

            return object;
        },
        base,
    );
}

/**
 * Merge 'production' or 'development' mode sub-ojbects into an object and remove
 * mode sub-objects
 *
 * @param {object} config Config
 * @returns {object} Config
 * @protected
 */
function mergeConfigMode(config) {
    if ('production' in config || 'development' in config) {
        const mode = global.production ? 'production' : 'development';
        const value = typeof config[mode] === 'undefined' ? config : merge(config, config[mode]);

        if (value !== false) {
            return omit(value, ['production', 'development']);
        } else {
            return value;
        }
    } else {
        return config;
    }
}

/**
 * Load config files
 *
 * @returns {object} Configuration
 * @protected
 */
async function loadConfig() {
    const taskFolder = path.resolve(__dirname, '../tasks');
    let taskConfig = {};

    await Promise.all(
        fs.readdirSync(taskFolder).map((folderName) => {
            // Ignore task folders which start with underscore
            if (folderName[0] !== '_') {
                const configFileName = path.resolve(taskFolder, folderName, 'config.js');

                try {
                    fs.accessSync(configFileName);
                } catch (err) {
                    return;
                }

                return import(configFileName).then((config) => {
                    taskConfig = merge(taskConfig, config);
                });
            }
        }),
    );

    return taskConfig;
}
