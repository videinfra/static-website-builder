import plumber  from 'gulp-plumber';

/**
 * Gulp task pipe function which handles errors
 */
export default function taskBeforeDest () {
    return plumber.stop();
}
