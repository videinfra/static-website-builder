const bs = require('browser-sync');
const getConfig = require('./../../lib/get-config');

exports.watch = function browserSync (callback) {
    bs.init(getConfig.getTaskConfig('browserSync'));
};
