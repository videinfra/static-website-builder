const gulp = require('gulp');
const size = require('gulp-sizereport');

const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');


function sizeReport () {
    return gulp
        .src(getPaths.getGlobPaths(getPaths.getDestPath()))
        .pipe(size(getConfig.getTaskConfig('sizereport')))
}


exports.afterBuild = sizeReport;
