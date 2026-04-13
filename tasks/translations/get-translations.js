import fs from 'fs';
import path from 'path';

import merge from '../../lib/merge.js';
import { getSourcePaths, getPathConfig } from '../../lib/get-path.js';
import logError from '../../lib/log-error.js';
import dataLoaderYml from '../data/data-loader-yml.js';

let cache = {};
let cacheTime = null;

export default function getTranslations(locale, group) {
    const build = global.production;

    // Invalidate cache after 1 second
    if (!build && cacheTime && Date.now() - cacheTime > 1000) {
        cache = {};
    }

    cacheTime = Date.now();

    if (cache[locale] && cache[locale][group]) {
        return cache[locale][group];
    } else {
        const folders = getSourcePaths('translations');

        folders.forEach((folder) => {
            const fullFilePath = path.resolve(folder, `${group}.${locale}.yml`);

            if (fs.existsSync(fullFilePath)) {
                try {
                    const fileData = dataLoaderYml(fullFilePath);
                    cache = merge(cache, { [locale]: { [group]: fileData }});
                } catch (err) {
                    logError({
                        message: `Failed to parse "${path.join(getPathConfig().src, getPathConfig().data.src, `${group}.${locale}.yml`)}"`,
                        plugin: 'data',
                    });
                    console.error(err.message);
                }
            }
        });

        if (cache[locale] && cache[locale][group]) {
            return cache[locale][group];
        } else {
            return {};
        }
    }
}
