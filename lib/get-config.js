const fs = require('fs');
const path = require('path');
const getPath = require('./get-path');
const runPreprocess = require('./run-preprocess');
const merge = require('./merge');

const each = require('lodash/each');
const omit = require('lodash/omit');
const isPlainObject = require('lodash/isPlainObject');
const isArray = require('lodash/isArray');
const reduce = require('lodash/reduce');
const get = require('lodash/get');


/**
 * Returns builder and project specific task and plugin configurations combined
 * Configuration is preprocessed
 *
 * @returns {object} Task configurations
 */

let taskConfig = null;

function getConfig () {
    if (!taskConfig) {
        // Load all task configs
        taskConfig = itterateConfig(loadConfig(), mergeConfigMode);

        // 1. First load project specific task-config.js
        const builderConfigFolder = process.env.BUILDER_CONFIG_PATH || 'config';
        const projectConfigPath = getPath.getProjectPath(builderConfigFolder, 'config.js');
        let   projectTaskConfig = {};

        try {
            fs.accessSync(projectConfigPath);
            projectTaskConfig = itterateConfig(require(projectConfigPath), mergeConfigMode);
        } catch (err) {}

        // 2. Marge plugins into the config, each plugin is just a config
        const plugins = (taskConfig.plugins || []).concat(projectTaskConfig.plugins || []);
        if (plugins) {
            taskConfig.plugins = null;
            projectTaskConfig.plugins = null;

            each(plugins, (plugin) => {
                taskConfig = merge(taskConfig, itterateConfig(plugin, mergeConfigMode));
            });
        }

        // 3. Only after plugins has benn executed, merge project specific task-config.js into main config
        if (projectTaskConfig) {
            taskConfig = merge(taskConfig, projectTaskConfig);
        }

        // 4. Preprocess
        taskConfig = runPreprocess(taskConfig);
    }

    return taskConfig;
};

/**
 * Returns task sub-config by path
 *
 * @param  {...string} path Path to the sub-config
 * @returns {any} Task sub-config
 */
function getTaskConfig (...path) {
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
function itterateConfig (config, fn) {
    const base = isPlainObject(config) ? {} : [];

    return reduce(config, (object, value, key) => {
        if (isPlainObject(value)) {
            object[key]= itterateConfig(fn(value), fn);
        } else if (isArray(value)) {
            object[key]= itterateConfig(value, fn);
        } else {
            object[key] = value;
        }

        return object;
    }, base);
}

/**
 * Merge 'production' or 'development' mode sub-ojbects into an object and remove
 * mode sub-objects
 *
 * @param {object} config Config
 * @returns {object} Config
 * @protected
 */
function mergeConfigMode (config) {
    if ('production' in config || 'development' in config) {
        const mode = global.production ? 'production' : 'development';
        return omit(merge(config, config[mode]), ['production', 'development']);
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
function loadConfig () {
    const taskFolder = path.resolve(__dirname, '../tasks');
    let taskConfig = {};

    fs.readdirSync(taskFolder).forEach(folderName => {
        // Ignore task folders which start with underscore
        if (folderName[0] !== '_') {
            const configFileName = path.resolve(taskFolder, folderName, 'config.js');

            try {
                fs.accessSync(configFileName);
            } catch (err) {
                return;
            }

            taskConfig = merge(taskConfig, require(configFileName));
        }
    });

    return taskConfig;
};


exports.getConfig = getConfig;
exports.getTaskConfig = getTaskConfig;
