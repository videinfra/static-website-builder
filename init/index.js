const path = require('../lib/get-path');
const copyFolder = require('../lib/init/copy-folder');
const readPackage = require('../lib/init/read-package');
const mergePackage = require('../lib/init/merge-package');
const folderExists = require('../lib/init/folder-exists');
const getFolderList = require('../lib/init/get-folder-list');
const chalk = require('chalk');

module.exports = function init (template = 'default') {
    let   templateName = template || 'default';
    let   copyFrom = path.getBuilderPath('init', templateName);
    const copyTo = path.getProjectPath();

    if (template === 'test' || !folderExists(copyFrom)) {
        console.log(chalk.red(`Template "${ templateName }" doesn't exist`));

        getFolderList(path.getBuilderPath('init')).then((templates) => {
            console.log('Available templates:');
            console.log(chalk.cyan(`    ${ templates.join('\n    ') }`));
        });
        return;
    }

    console.log(chalk.magenta(`Generating project files using template "${ templateName }"`));

    // Copy files
    const filesCopied = copyFolder(copyFrom, copyTo);

    // Merge template package.json into projects package.json
    const packageMerged = readPackage(path.getBuilderPath('init', templateName, 'package.json'), {}).then((package) => {
        return mergePackage(path.getProjectPath('package.json'), package).then(() => {
            if (package.dependencies || package.devDependencies) {
                console.log(chalk.magenta('Installing npm dependencies'));

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
        console.log(chalk.green('All done\n'));

        console.log('To start the dev server:\n' + chalk.cyan('    npm run start'));

        console.log('To build the project:\n' + chalk.cyan('    npm run build'));
    }, (err) => {
        throw err;
    });
}
