const fs = require('fs');
const logError = require('../lib/log-error');

module.exports = function addCommandsToPackage (fileName, commands) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, {'encoding': 'utf8'}, (err, data) => {
            if (err) {
                reject(err);
            }

            try {
                const package = JSON.parse(data);
                let changed = false;

                package.scripts = package.scripts || {};

                for (let key in commands) {
                    if (package.scripts[key] !== commands[key]) {
                        package.scripts[key] = commands[key];
                        changed = true;
                    }
                }

                if (changed) {
                    fs.writeFile(fileName, JSON.stringify(package, null, '  '), (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    resolve();
                }
            } catch (err) {
                reject(err);
            }
        });
    });
};
