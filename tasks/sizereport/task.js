const gulp = require('gulp');
const size = require('gulp-sizereport');

const paths = require('./../../lib/get-path');
const config = require('./../../lib/get-config');


function sizeReport () {
    return gulp
        .src(paths.getGlobPaths(paths.getDestPath()))
        .pipe(size(config.getTaskConfig('sizereport')))
}


exports.afterBuild = sizeReport;
