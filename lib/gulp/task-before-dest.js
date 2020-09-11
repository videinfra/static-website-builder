const plumber = require('gulp-plumber');

/**
 * Gulp task pipe function which handles errors
 */
module.exports = function taskBeforeDest () {
    return plumber.stop();
}
