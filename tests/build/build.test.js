import path from 'path';
import { fileURLToPath } from 'node:url';
import fsPromises from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.resolve(__dirname, 'public');

test('Font file woff copied', () => {
    expect.assertions(1);
    return expect(fsPromises.access(path.resolve(publicPath, 'assets/fonts/font.woff'))).resolves.toBe(undefined);
});

test('Font file fake not copied', () => {
    expect.assertions(1);
    return expect(fsPromises.access(path.resolve(publicPath, 'assets/fonts/font.fake'))).rejects.toThrow('no such file or directory');
});

test('icons generated', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/images/icons.svg'), { encoding: 'utf8' }).then((svg) => {
        expect(svg.indexOf('<symbol id="example-arrow" viewBox="0 0 20 20">')).not.toBe(-1);
    });
});

test('image copied', () => {
    expect.assertions(1);
    return expect(fsPromises.access(path.resolve(publicPath, 'assets/images/px.gif'))).resolves.toBe(undefined);
});

test('static copied', () => {
    expect.assertions(1);
    return expect(fsPromises.access(path.resolve(publicPath, 'assets/manifest/manifest.webmanifest'))).resolves.toBe(undefined);
});

test('static file merged into images', () => {
    expect.assertions(1);
    return expect(fsPromises.access(path.resolve(publicPath, 'assets/images/static.png'))).resolves.toBe(undefined);
});
