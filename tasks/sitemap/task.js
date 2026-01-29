import gulp from 'gulp';
import gulpif from 'gulp-if';
import nanomemoize from 'nano-memoize';
import ignore from 'gulp-ignore';
import gulpSitemap from 'gulp-sitemap';

import { getDestPath } from './../../lib/get-path.js';
import { getTaskConfig } from './../../lib/get-config.js';
import globs from './../../lib/globs-helper.js';

import taskStart from '../../lib/gulp/task-start.js';
import taskEnd from '../../lib/gulp/task-end.js';
import taskBeforeDest from '../../lib/gulp/task-before-dest.js';
import taskWatch from '../../lib/gulp/task-watch.js';

const getWatchGlobPaths = function (forChokidar = false) {
    const sourcePaths = getDestPath('html');
    const extensions = getTaskConfig('sitemap', 'extensions');

    return globs.generate(
        [
            globs.paths(sourcePaths).filesWithExtensions(extensions), // HTML files
            globs.paths(gulp.dest(getDestPath('sitemap', 'sitemap.xml'))).ignore(),
        ],
        forChokidar,
    );
};
const getGlobPaths = nanomemoize.nanomemoize(function () {
    return getWatchGlobPaths(false);
});

const getGlobIgnorePaths = nanomemoize.nanomemoize(function () {
    const ignore = getTaskConfig('sitemap', 'ignore');

    return globs.generate([
        globs.paths(ignore), // Exclude files and folders from being rendered
    ]);
});

function sitemap() {
    return (
        gulp
            .src(getGlobPaths())
            .pipe(taskStart())

            // Prevent file from being rendered if it's in the ignore list
            .pipe(gulpif(!!getGlobIgnorePaths().length, ignore.exclude(getGlobIgnorePaths(), {})))

            // Preprocess sitemap
            .pipe(gulpSitemap(getTaskConfig('sitemap').sitemap))

            .pipe(taskBeforeDest())
            .pipe(gulp.dest(getDestPath('sitemap')))

            // Reload on change
            .pipe(taskEnd())
    );
}

function sitemapWatch() {
    // Watch and execute immediatelly so that sitemap is generated on first run
    return taskWatch(getWatchGlobPaths(true), sitemap) && sitemap();
}

// Execute after HTML task
sitemapWatch.order = 1;

export const afterBuild = sitemap;
export const watch = sitemapWatch;
