import fs from 'fs';
import yaml from 'js-yaml';

export default function dataLoaderYML(fileName) {
    return yaml.load(fs.readFileSync(fileName, 'utf8'));
}
