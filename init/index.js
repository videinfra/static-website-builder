import { getBuilderPath, getProjectPath } from '../lib/get-path.js';
import copyFolder from '../lib/init/copy-folder.js';
import readPackage from '../lib/init/read-package.js';
import mergePackage from '../lib/init/merge-package.js';
import folderExists from '../lib/init/folder-exists.js';
import getFolderList from '../lib/init/get-folder-list.js';

import chalk from 'chalk';
import { exec } from 'child_process';

export default function init(template = 'default') {
    let templateName = template || 'default';
    let copyFrom = getBuilderPath('init', templateName);
    const copyTo = getProjectPath();

    if (template === 'test' || !folderExists(copyFrom)) {
        console.log(chalk.red(`Template "${templateName}" doesn't exist`));

        getFolderList(getBuilderPath('init')).then((templates) => {
            console.log('Available templates:');
            console.log(chalk.cyan(`    ${templates.join('\n    ')}`));
        });
        return;
    }

    console.log(chalk.magenta(`Generating project files using template "${templateName}"`));

    // Copy files
    const filesCopied = copyFolder(copyFrom, copyTo);

    // Merge template package.json into projects package.json
    const packageMerged = readPackage(getBuilderPath('init', templateName, 'package.json'), {}).then((packageJSON) => {
        return mergePackage(getProjectPath('package.json'), packageJSON)
            .then(() => {
                if (packageJSON.dependencies || packageJSON.devDependencies) {
                    console.log(chalk.magenta('Installing npm dependencies'));

                    return new Promise((resolve, _reject) => {
                        exec('npm install', function (_error, _stdout, _stderr) {
                            resolve();
                        });
                    });
                }
            })
            .catch((_err) => {
                // Skip errors
                return Promise.resolve();
            });
    });

    Promise.all([filesCopied, packageMerged]).then(
        () => {
            console.log(chalk.green('All done\n'));

            console.log('To start the dev server:\n' + chalk.cyan('    npm run start'));

            console.log('To build the project:\n' + chalk.cyan('    npm run build'));
        },
        (err) => {
            throw err;
        },
    );
}
