import del from 'del';
import { getTaskConfig } from '../../lib/get-config.js';

export function beforeBuild(callback) {
    const patterns = getTaskConfig('clean', 'patterns');
    return del(patterns, { force: true });
}
