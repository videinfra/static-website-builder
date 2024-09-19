const plumber = require('gulp-plumber');
const logError = require('../log-error');

/**
 * Gulp task pipe function which handles errors
 */
module.exports = function taskStart () {
    return plumber(function (error) {
        // Fail whole gulp process if in production mode
        logError.call(this, error, global.production);
    });
}
