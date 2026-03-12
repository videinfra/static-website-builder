import path from 'path';
import { fileURLToPath } from 'node:url';
import fsPromises from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.resolve(__dirname, 'public');

test('shared.js file exists', () => {
    return Promise.all([
        fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/shared.js'), { encoding: 'utf8' }).then((js) => {
            expect(js.indexOf('console.log(`Shared file loaded`)')).not.toBe(-1);
        }),
    ]);
});

test('main.js file exists', () => {
    return Promise.all([
        fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/main.js'), { encoding: 'utf8' }).then((js) => {
            expect(js.indexOf('console.log(`Hello from main page!`')).not.toBe(-1);
        }),
        fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/alt/main.js'), { encoding: 'utf8' }).then((js) => {
            expect(js.indexOf('console.log(`Hello from main page!`')).not.toBe(-1);
        }),
    ]);
});

test('other.js file exists', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/other.js'), { encoding: 'utf8' }).then((js) => {
        expect(js.indexOf('console.log(`Hello from other page!`)')).not.toBe(-1);
    });
});

test('something.ts was converted', () => {
    return Promise.all([
        fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/something.js'), { encoding: 'utf8' }).then((js) => {
            expect(js.indexOf('console.log({name:`something`})')).not.toBe(-1);
        }),
    ]);
});

test("alt/other.js file doesn't exist", async () => {
    expect(fsPromises.stat(path.resolve(publicPath, 'assets/javascripts/alt/other.js'))).rejects.toThrow();
});
