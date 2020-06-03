const gulp = require('gulp');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
// const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');

const paths = require('./../../lib/get-path');
const config = require('./../../lib/get-config');
const logError = require('./../../lib/log-error');

let gulpTaskSourcePaths;


function getGlobPaths () {
    if (!gulpTaskSourcePaths) {
        const sourcePaths = paths.getSourcePaths('stylesheets');
        const extensions = config.getTaskConfig('stylesheets', 'extensions');
        gulpTaskSourcePaths = paths.getGlobPaths(sourcePaths, extensions);
    }

    return gulpTaskSourcePaths;
}

function stylesheets () {
    return gulp.src(getGlobPaths())
        .pipe(plumber(logError))

        .pipe(gulpif(!!config.getTaskConfig('stylesheets', 'sourcemaps'), sourcemaps.init(config.getTaskConfig('stylesheets', 'sourcemaps', 'init')))) // Start Sourcemaps
        .pipe(gulpif(!!config.getTaskConfig('stylesheets', 'sass'), sass(config.getTaskConfig('stylesheets', 'sass')).on('error', sass.logError)))

        // Autoprefixer, postcss
        .pipe(gulpif(!!config.getTaskConfig('stylesheets', 'postcss'), postcss(config.getTaskConfig('stylesheets', 'postcss', 'plugins'), config.getTaskConfig('stylesheets', 'postcss', 'options'))))

        .pipe(gulpif(!!config.getTaskConfig('stylesheets', 'sourcemaps'), sourcemaps.write('.', config.getTaskConfig('stylesheets', 'sourcemaps', 'write'))))

        .pipe(plumber.stop())
        .pipe(gulp.dest(paths.getDestPath('stylesheets')))

        // Reload on change
        .pipe(gulpif(!!config.getTaskConfig('browserSync'), browserSync.stream()));
}

function stylesheetsWatch () {
    return gulp.watch(getGlobPaths(), stylesheets);
}


exports.build = stylesheets;
exports.watch = stylesheetsWatch;
