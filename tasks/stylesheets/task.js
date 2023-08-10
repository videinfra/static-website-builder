const gulp = require('gulp');
const gulpif = require('gulp-if');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const memoize = require('nano-memoize').default;
const cached = require('gulp-cached');
const dependents = require('gulp-dependents');

const globs = require('./../../lib/globs-helper');
const getPaths = require('../../lib/get-path');
const getConfig = require('../../lib/get-config');

const taskStart = require('../../lib/gulp/task-start');
const taskEnd = require('../../lib/gulp/task-end');
const taskBeforeDest = require('../../lib/gulp/task-before-dest');
const taskWatch = require('../../lib/gulp/task-watch');


const getGlobPaths = memoize(function () {
    const sourcePaths = getPaths.getSourcePaths('stylesheets');
    const extensions = getConfig.getTaskConfig('stylesheets', 'extensions');
    const ignore = getConfig.getTaskConfig('stylesheets', 'ignore');

    return globs.generate(
        globs.paths(sourcePaths).filesWithExtensions(extensions), // Files to watch
        globs.paths(sourcePaths).paths(ignore).ignore(),          // List of files which to ignore
    );
});


const getEngine = memoize(function () {
    const engine = getConfig.getTaskConfig('stylesheets', 'engine');
    return engine ? engine() : (() => {});
});


function stylesheets () {
    // console.log(getConfig.getTaskConfig('stylesheets', 'dependents'));
    return gulp.src(getGlobPaths())
        .pipe(taskStart())

        // Faster incremental builds, skip files which didn't changed or their dependencies didn't changed
        .pipe(gulpif(!!getConfig.getTaskConfig('stylesheets', 'dependents'), cached('stylesheets')))
        .pipe(gulpif(!!getConfig.getTaskConfig('stylesheets', 'dependents'), dependents(getConfig.getTaskConfig('dependents'))))

        .pipe(gulpif(!!getConfig.getTaskConfig('stylesheets', 'sourcemaps'), sourcemaps.init(getConfig.getTaskConfig('stylesheets', 'sourcemaps', 'init')))) // Start Sourcemaps

        // Engine
        .pipe(gulpif(!!getConfig.getTaskConfig('stylesheets', 'engine'), getEngine()))

        // Autoprefixer, postcss
        .pipe(gulpif(!!getConfig.getTaskConfig('stylesheets', 'postcss'), postcss(getConfig.getTaskConfig('stylesheets', 'postcss', 'plugins'), getConfig.getTaskConfig('stylesheets', 'postcss', 'options'))))

        .pipe(gulpif(!!getConfig.getTaskConfig('stylesheets', 'sourcemaps'), sourcemaps.write('.', getConfig.getTaskConfig('stylesheets', 'sourcemaps', 'write'))))

        .pipe(taskBeforeDest())
        .pipe(gulp.dest(getPaths.getDestPath('stylesheets')))

        // Reload on change
        .pipe(taskEnd());
}

function stylesheetsWatch () {
    return taskWatch(getGlobPaths(), stylesheets);
}


exports.build = stylesheets;
exports.watch = stylesheetsWatch;
