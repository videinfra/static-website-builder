import fs from 'fs';

export default function dataLoaderJSON(fileName) {
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}
