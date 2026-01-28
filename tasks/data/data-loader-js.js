import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export default function dataLoaderJS (fileName) {
    // Re-load script each time this function is called
    delete require.cache[require.resolve(fileName)];
    const data = require(fileName);

    if (data && Object.prototype.toString.call(data) === '[object Module]') {
        return data.default;
    } else {
        return data;
    }
};
