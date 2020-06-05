const gulp = require('gulp');
const gulpif = require('gulp-if');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const memoize = require('nano-memoize');

const globs = require('./../../lib/globs-helper');
const getPaths = require('../../lib/get-path');
const getConfig = require('../../lib/get-config');

const taskStart = require('../../gulp/task-start');
const taskEnd = require('../../gulp/task-end');


const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('stylesheets');
    const extensions = getConfig.getTaskConfig('stylesheets', 'extensions');
    const ignore = getConfig.getTaskConfig('stylesheets', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).withExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(),     // List of files which to ignore
    );
});


const getEngine = memoize(function () {
    const engine = getConfig.getTaskConfig('stylesheets', 'engine');
    return engine ? engine() : (() => {});
});


function stylesheets () {
    return gulp.src(getGlobPaths())
        .pipe(taskStart())

        .pipe(gulpif(!!getConfig.getTaskConfig('stylesheets', 'sourcemaps'), sourcemaps.init(getConfig.getTaskConfig('stylesheets', 'sourcemaps', 'init')))) // Start Sourcemaps

        // Engine
        .pipe(gulpif(!!getConfig.getTaskConfig('stylesheets', 'engine'), getEngine()))

        // Autoprefixer, postcss
        .pipe(gulpif(!!getConfig.getTaskConfig('stylesheets', 'postcss'), postcss(getConfig.getTaskConfig('stylesheets', 'postcss', 'plugins'), getConfig.getTaskConfig('stylesheets', 'postcss', 'options'))))

        .pipe(gulpif(!!getConfig.getTaskConfig('stylesheets', 'sourcemaps'), sourcemaps.write('.', getConfig.getTaskConfig('stylesheets', 'sourcemaps', 'write'))))

        .pipe(gulp.dest(getPaths.getDestPath('stylesheets')))

        // Reload on change
        .pipe(taskEnd());
}

function stylesheetsWatch () {
    return gulp.watch(getGlobPaths(), stylesheets);
}


exports.build = stylesheets;
exports.watch = stylesheetsWatch;
