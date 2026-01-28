import gulp  from 'gulp';
import size  from 'gulp-sizereport';

import globs  from './../../lib/globs-helper.js';
import { getDestPath } from './../../lib/get-path.js';
import { getTaskConfig } from './../../lib/get-config.js';


function sizeReport () {
    return gulp
        .src(globs.paths(getDestPath()).allFiles().generate())
        .pipe(size(getTaskConfig('sizereport')))
}


export const afterBuild = sizeReport;
