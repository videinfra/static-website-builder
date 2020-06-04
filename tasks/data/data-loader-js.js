const fs = require('fs');
const vm = require('vm');

module.exports = function dataLoaderJS (fileName) {
    // Re-load script each time this function is called
    const script = new vm.Script(`let module = {}; let exports = {}; ${ fs.readFileSync(fileName, 'utf8') };`);
    const fileData = script.runInNewContext();

    return fileData;
};
