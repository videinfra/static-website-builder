import * as siteReportTask from './task.js';

/**
 * Generates a size report for all files in the output folder
 */

export const sizereport = {
    // Development only settings, overwrites default settings
    // disabled for development mode
    development: false,

    // Production only settings, overwrites default settings
    production: {
        // see https://www.npmjs.com/package/gulp-sizereport#options
        gzip: true
    }
};

export const tasks = {
    sizereport: [
        siteReportTask,
    ]
};
