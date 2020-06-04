const fs = require('fs');

module.exports = function dataLoaderJSON (fileName) {
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
};
