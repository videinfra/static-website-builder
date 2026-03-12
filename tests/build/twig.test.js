import path from 'path';
import { fileURLToPath } from 'node:url';
import fsPromises from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.resolve(__dirname, 'public');

test('TWIG templates rendered and minified with JS and JSON data', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'index.html'), { encoding: 'utf8' }).then((html) => {
        expect(html).toBe('<html><body><h1>Hello World!</h1></body></html>');
    });
});

test('Multiple TWIG templates rendered', () => {
    expect.assertions(1);
    return expect(fsPromises.access(path.resolve(publicPath, 'other.html'))).resolves.toBe(undefined);
});

test('currentPagePath available in templates', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'other.html'), { encoding: 'utf8' }).then((html) => {
        expect(html.indexOf('Current page path: "/other"')).not.toBe(-1);
    });
});
