const gulp = require('gulp');
const size = require('gulp-sizereport');

const globs = require('./../../lib/globs-helper');
const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');


function sizeReport () {
    return gulp
        .src(globs.paths(getPaths.getDestPath()).allFiles().generate())
        .pipe(size(getConfig.getTaskConfig('sizereport')))
}


exports.afterBuild = sizeReport;
