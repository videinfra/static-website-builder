const getConfig = require('./../lib/get-config');
const generateGulpTasks = require('./../lib/generate-gulp-tasks');

// Set mode globally it can be used by tasks
const hasProductionArg = process.argv.indexOf('build') !== -1;

global.production = global.production || (hasProductionArg || process.env.NODE_ENV === 'production');
global.development = !global.production;

// Config file
let builderConfigFile = process.env.BUILDER_CONFIG_FILE || 'config/config.js';

if (process.argv.indexOf('--config') !== -1) {
    builderConfigFile = process.argv[process.argv.indexOf('--config') + 1];
} else {
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i].indexOf('--config=') !== -1) {
            builderConfigFile = process.argv[i].substr(9);
        }
    }
}

// Load all config files and generate gulp tasks
module.exports = generateGulpTasks(getConfig.getConfig(builderConfigFile));
