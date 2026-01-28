export const BEFORE_BUILD = 'beforeBuild';
export const BUILD        = 'build';
export const AFTER_BUILD  = 'afterBuild';

export const BEFORE_WATCH = 'beforeWatch';
export const WATCH        = 'watch';

export const DEFAULT_TASKS = [
    BEFORE_BUILD,
    BUILD,
    BEFORE_WATCH,
    WATCH,
];

export const BUILD_TASKS = [
    BEFORE_BUILD,
    BUILD,
    AFTER_BUILD,
];
