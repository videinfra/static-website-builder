const path = require('../lib/get-path');
const copyFolder = require('./copy-folder');
const addCommandsToPackage = require('./add-commands');

const copyFrom = path.getBuilderPath('src');
const copyTo = path.getProjectPath('src');

const COLOR_GREEN = '\x1b[32m';
const COLOR_RESET = '\x1b[0m';
const COLOR_MAGENTA = '\x1b[45m';
const COLOR_CYAN = '\x1b[36m';

console.log(`${ COLOR_GREEN }Generating default project files${ COLOR_RESET }`);

// Copy files
const filesCopied = copyFolder(copyFrom, copyTo);

// Add commands to package.json
const commandName = Object.keys(require('../package.json').bin)[0];
const commandsAdded = addCommandsToPackage(path.getProjectPath('package.json'), {
    'start': `${ commandName }`,
    'development': `${ commandName }`,
    'build': `${ commandName } -- build`,
    'production': `${ commandName } -- build`,
});

Promise.all([filesCopied, commandsAdded]).then(() => {
    console.log(`To start the dev server:
    ${ COLOR_CYAN }npm run start${ COLOR_RESET }`);

    console.log(`To build the project:
    ${ COLOR_CYAN }npm run build${ COLOR_RESET }`);
}, (err) => {
    throw err;
});
