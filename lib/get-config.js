const fs = require('fs');
const path = require('path');
const getPath = require('./get-path');
const runPreprocess = require('./run-preprocess');
const merge = require('./merge');
const logError = require('./log-error');

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

function getConfig (builderConfigFile) {
    if (!taskConfig) {
        // Load all task configs
        taskConfig = itterateConfig(loadConfig(), mergeConfigMode);

        // 1. First load project specific config.js
        const projectConfigPath = getPath.getProjectPath(builderConfigFile);
        let   projectTaskConfig = {};
        let   hasProjectConfigFile = true;

        try {
            fs.accessSync(projectConfigPath);
        } catch (err) {
            logError({'plugin': 'static-website-builder', 'message': `Couldn't find configuration file "${ projectConfigPath }"`});
            hasProjectConfigFile = false;
        }

        if (hasProjectConfigFile) {
            projectTaskConfig = itterateConfig(require(projectConfigPath), mergeConfigMode);
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
    if (config === false) return false;
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
        const value = merge(config, config[mode]);

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
