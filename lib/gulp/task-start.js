const plumber = require('gulp-plumber');
const logError = require('../log-error');

/**
 * Gulp task pipe function which handles errors
 */
module.exports = function taskStart () {
    return plumber(function (error) {
        logError.call(this, error, true);
    });
}
