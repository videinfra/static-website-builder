const getConfig = require('./../lib/get-config');
const generateGulpTasks = require('./../lib/generate-gulp-tasks');

// Set mode globally it can be used by tasks
const hasProductionArg = process.argv.indexOf('build') !== -1;

global.production = global.production || (hasProductionArg || process.env.NODE_ENV === 'production');
global.development = !global.production;

// Load all config files and generate gulp tasks
module.exports = generateGulpTasks(getConfig.getConfig());
