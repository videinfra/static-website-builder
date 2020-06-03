const fs = require('fs');
const path = require('path');
const merge = require('../lib/merge');

const taskFolder = path.resolve(__dirname, '../tasks');
let taskConfig = {};

// Read all tasks/.../confg.js files and merge them
fs.readdirSync(taskFolder).forEach(folderName => {
    // Ignore folders which start with underscore
    if (folderName[0] !== '_') {
        const configFileName = path.resolve(taskFolder, folderName, 'config.js');

        if (fs.existsSync(configFileName)) {
            taskConfig = merge(taskConfig, require(configFileName));
        }
    }
});


module.exports = taskConfig;
