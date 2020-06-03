const bs = require('browser-sync');
const config = require('./../../lib/get-config');

exports.watch = function browserSync (callback) {
    bs.init(config.getTaskConfig('browserSync'));
};
