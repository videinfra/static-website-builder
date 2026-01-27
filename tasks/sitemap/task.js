const gulp = require('gulp');
const gulpif = require('gulp-if');
const memoize = require('nano-memoize');
const ignore = require('gulp-ignore');
const gulpSitemap = require('gulp-sitemap');

const getPaths = require('./../../lib/get-path');
const getConfig = require('./../../lib/get-config');
const globs = require('./../../lib/globs-helper');

const taskStart = require('../../lib/gulp/task-start');
const taskEnd = require('../../lib/gulp/task-end');
const taskBeforeDest = require('../../lib/gulp/task-before-dest');
const taskWatch = require('../../lib/gulp/task-watch');

const getWatchGlobPaths = function (forChokidar = false) {
    const sourcePaths = getPaths.getDestPath('html');
    const extensions = getConfig.getTaskConfig('sitemap', 'extensions');

    return globs.generate([
        globs.paths(sourcePaths).filesWithExtensions(extensions), // HTML files
        globs.paths(gulp.dest(getPaths.getDestPath('sitemap', 'sitemap.xml'))).ignore(),
    ], forChokidar);
};
const getGlobPaths = memoize(function () {
    return getWatchGlobPaths(false);
});

const getGlobIgnorePaths = memoize(function () {
    const ignore = getConfig.getTaskConfig('sitemap', 'ignore');

    return globs.generate([
        globs.paths(ignore),         // Exclude files and folders from being rendered
    ]);
});

function sitemap () {
    return gulp.src(getGlobPaths())
        .pipe(taskStart())

        // Prevent file from being rendered if it's in the ignore list
        .pipe(gulpif(!!getGlobIgnorePaths().length, ignore.exclude(getGlobIgnorePaths(), {})))

        // Preprocess sitemap
        .pipe(gulpSitemap(getConfig.getTaskConfig('sitemap').sitemap))

        .pipe(taskBeforeDest())
        .pipe(gulp.dest(getPaths.getDestPath('sitemap')))

        // Reload on change
        .pipe(taskEnd());
}

function sitemapWatch () {
    // Watch and execute immediatelly so that sitemap is generated on first run
    return taskWatch(getWatchGlobPaths(true), sitemap) && sitemap();
}

exports.afterBuild = sitemap;
exports.watch = sitemapWatch;

// Execute after HTML task
exports.watch.order = 1;
