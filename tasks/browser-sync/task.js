import bs from 'browser-sync';
import { getTaskConfig } from './../../lib/get-config.js';

export const watch = function browserSync(callback) {
    bs.init(getTaskConfig('browserSync'));
};

// Execute as first task
watch.order = -2;
