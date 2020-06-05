const del = require('del')
const getConfig = require('./../../lib/get-config');

exports.beforeBuild = function clean (callback) {
    const patterns = getConfig.getTaskConfig('clean', 'patterns');
    return del(patterns, { force: true });
};
