const del = require('del')
const config = require('./../../lib/get-config');

exports.beforeBuild = function clean (callback) {
    const patterns = config.getTaskConfig('clean', 'patterns');
    return del(patterns, { force: true });
};
