const gulpif = require('gulp-if');
const getConfig = require('../lib/get-config');
const browserSync = require('browser-sync');

/**
 * Gulp task pipe function which handles browsersync reloading
 */
module.exports = function taskEnd () {
    return gulpif(!!getConfig.getTaskConfig('browserSync'), browserSync.stream());
};
