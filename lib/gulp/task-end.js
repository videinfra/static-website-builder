import gulpif  from 'gulp-if';
import { getTaskConfig } from '../get-config.js';
import browserSync  from 'browser-sync';

/**
 * Gulp task pipe function which handles browsersync reloading
 */
export default function taskEnd () {
    return gulpif(!!getTaskConfig('browserSync'), browserSync.stream());
};
