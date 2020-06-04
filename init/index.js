const path = require('../lib/get-path');
const merge = require('../lib/merge');
const copyFolder = require('../lib/init/copy-folder');
const readPackage = require('../lib/init/read-package');
const mergePackage = require('../lib/init/merge-package');
const folderExists = require('../lib/init/folder-exists');
const getFolderList = require('../lib/init/get-folder-list');

const COLOR_RED = '\x1b[31m';
const COLOR_GREEN = '\x1b[32m';
const COLOR_RESET = '\x1b[0m';
const COLOR_MAGENTA = '\x1b[35m';
const COLOR_CYAN = '\x1b[36m';


module.exports = function init (template = 'default') {
    let   templateName = template || 'default';
    let   copyFrom = path.getBuilderPath('init', templateName);
    const copyTo = path.getProjectPath();

    if (!folderExists(copyFrom)) {
        console.log(`${ COLOR_RED }Template "${ templateName }" doesn't exist${ COLOR_RESET }`);

        getFolderList(path.getBuilderPath('init')).then((templates) => {
            console.log('Available templates:');
            console.log(`${ COLOR_CYAN }    ` + templates.join('\n    ') + `${ COLOR_RESET }`);
        });
        return;
    }

    console.log(`${ COLOR_MAGENTA }Generating project files using template "${ templateName }"${ COLOR_RESET }`);

    // Copy files
    const filesCopied = copyFolder(copyFrom, copyTo);

    // Merge template package.json into projects package.json
    const packageMerged = readPackage(path.getBuilderPath('init', templateName, 'package.json'), {}).then((package) => {
        return mergePackage(path.getProjectPath('package.json'), package).then(() => {
            if (package.dependencies || package.devDependencies) {
                console.log(`${ COLOR_MAGENTA }Installing npm dependencies${ COLOR_RESET }`);

                return new Promise((resolve, reject) => {
                    require('child_process').exec('npm install', function (error, stdout, stderr) {
                        resolve();
                    });
                });
            }
        }).catch((err) => {
            // Skip errors
            return Promise.resolve();
        });
    });

    Promise.all([filesCopied, packageMerged]).then(() => {
        console.log(`${ COLOR_GREEN }All done.${ COLOR_RESET }\n`);

        console.log(`To start the dev server:\n    ${ COLOR_CYAN }npm run start${ COLOR_RESET }`);

        console.log(`To build the project:\n    ${ COLOR_CYAN }npm run build${ COLOR_RESET }`);
    }, (err) => {
        throw err;
    });
}
