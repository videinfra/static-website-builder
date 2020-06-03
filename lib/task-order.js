const BEFORE_BUILD = 'beforeBuild';
const BUILD        = 'build';
const AFTER_BUILD  = 'afterBuild';

const BEFORE_WATCH = 'beforeWatch';
const WATCH        = 'watch';
const AFTER_WATCH  = 'afterWatch';

exports.BEFORE_BUILD = BEFORE_BUILD;
exports.BUILD = BUILD;
exports.AFTER_BUILD = AFTER_BUILD;
exports.BEFORE_WATCH = BEFORE_WATCH;
exports.WATCH = WATCH;
exports.AFTER_WATCH = AFTER_WATCH;

exports.DEFAULT_TASKS = [
    BEFORE_BUILD,
    BUILD,
    BEFORE_WATCH,
    WATCH,
    AFTER_WATCH,
    AFTER_BUILD,
];

exports.BUILD_TASKS = [
    BEFORE_BUILD,
    BUILD,
    AFTER_BUILD,
];
