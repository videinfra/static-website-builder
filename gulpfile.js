import { getConfigAsync } from './lib/get-config.js';
import generateGulpTasks from './lib/generate-gulp-tasks.js';

// Set mode globally it can be used by tasks
let hasProductionArg = false;

for (let i = 0; i < process.argv.length; i++) {
    const argValue = process.argv[i];
    // If build task is 'build' or '...-build' then set production mode
    if (argValue === 'build' || argValue.match(/^[a-z0-9-]+-build$/)) {
        hasProductionArg = true;
    }
}

global.production = global.production || hasProductionArg || process.env.NODE_ENV === 'production';
global.development = !global.production;

// Config file
let builderConfigFile = process.env.BUILDER_CONFIG_FILE || 'config/config.js';

if (process.argv.indexOf('--config') !== -1) {
    builderConfigFile = process.argv[process.argv.indexOf('--config') + 1];
} else {
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i].indexOf('--config=') !== -1) {
            builderConfigFile = process.argv[i].substr(9);
        }
    }
}

// Load all config files and generate gulp tasks
const gulpTasks = generateGulpTasks(await getConfigAsync(builderConfigFile));

// Expose main tasks
export const build = gulpTasks.build;
export const watch = gulpTasks.watch;

// Expose separate tasks
export const clean = gulpTasks['clean-beforeBuild'];

export const fonts = gulpTasks['fonts-build'];
export const fontsWatch = gulpTasks['fonts-watch'];

export const html = gulpTasks['html-build'];
export const htmlWatch = gulpTasks['html-watch'];

export const icons = gulpTasks['icons-build'];
export const iconsWatch = gulpTasks['icons-watch'];

export const images = gulpTasks['images-build'];
export const imagesWatch = gulpTasks['images-watch'];

export const sitemap = gulpTasks['sitemap-afterBuild'];
export const sitemapWatch = gulpTasks['sitemap-watch'];

export const staticFiles = gulpTasks['staticFiles-build'];
export const staticFilesWatch = gulpTasks['staticFiles-watch'];

export const stylesheets = gulpTasks['stylesheets-build'];
export const stylesheetsWatch = gulpTasks['stylesheets-watch'];

export const javascripts = gulpTasks['javascripts-build'];
export const javascriptsWatch = gulpTasks['javascripts-watch'];
