const fs = require('fs');
const vm = require('vm');
const merge = require('../../lib/merge');

module.exports = {
    'js': function (fileName) {
        // Re-load script each time this function is called
        const script = new vm.Script(`let module = {}; let exports = {}; ${ fs.readFileSync(fileName, 'utf8') };`);
        const fileData = script.runInNewContext();

        return fileData;
    },
    'json': function (fileName) {
        return JSON.parse(fs.readFileSync(fileName, 'utf8'));
    }
};
