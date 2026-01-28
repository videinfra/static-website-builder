import plumber  from 'gulp-plumber';
import logError  from '../log-error.js';

/**
 * Gulp task pipe function which handles errors
 */
export default function taskStart () {
    return plumber(function (error) {
        // Fail whole gulp process if in production mode
        logError.call(this, error, global.production);
    });
}
