const isPlainObject = require('lodash/isPlainObject');

/**
 * Call all preprocess functions, preprocess validates and transforms configuration
 *
 * @param {object} taskConfig Task config
 * @returns {object} Preprocessed task config
 */
module.exports = function runPreprocess (taskConfig) {
    if (taskConfig.preprocess) {
        for (let taskName in taskConfig.preprocess) {
            // Make sure task is not disabled
            if (taskConfig[taskName] !== false) {
                const functions = taskConfig.preprocess[taskName];

                for (let i = 0; i < functions.length; i++) {
                    let newTaskConfig = functions[i](taskConfig[taskName], taskConfig);

                    if (newTaskConfig === false) {
                        taskConfig[taskName] = false;
                        break;
                    } else if (newTaskConfig && isPlainObject(newTaskConfig)) {
                        // Safeguard against empty values
                        taskConfig[taskName] = newTaskConfig;
                    }
                }
            }
        }
    }

    return taskConfig;
}
