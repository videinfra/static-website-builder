const plumber = require('gulp-plumber');
const logError = require('../lib/log-error');

/**
 * Gulp task pipe function which handles errors
 */
module.exports = function taskStart () {
    return plumber(logError);
}
