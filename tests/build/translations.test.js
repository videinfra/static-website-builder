import path from 'path';
import { fileURLToPath } from 'node:url';
import fsPromises from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.resolve(__dirname, 'public');

test('Translation EN paths', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'translation.html'), { encoding: 'utf8' }).then((html) => {
        expect(html.indexOf('<p>ROUTE: /translation</p>')).not.toBe(-1);
        expect(html.indexOf('<p>PATH: /translation</p>')).not.toBe(-1);
        expect(html.indexOf('<p>DE_PATH: /de/translation</p>')).not.toBe(-1);
        expect(html.indexOf('<p>EN_PATH: /translation</p>')).not.toBe(-1);

        expect(html.indexOf('<p>HOMEPAGE PATH: /</p>')).not.toBe(-1);
        expect(html.indexOf('<p>HOMEPAGE DE_PATH: /de/</p>')).not.toBe(-1);
        expect(html.indexOf('<p>HOMEPAGE EN_PATH: /</p>')).not.toBe(-1);
    });
});

test('Translation DE paths', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'de/translation.html'), { encoding: 'utf8' }).then((html) => {
        expect(html.indexOf('<p>ROUTE: /translation</p>')).not.toBe(-1);
        expect(html.indexOf('<p>PATH: /de/translation</p>')).not.toBe(-1);
        expect(html.indexOf('<p>DE_PATH: /de/translation</p>')).not.toBe(-1);
        expect(html.indexOf('<p>EN_PATH: /translation</p>')).not.toBe(-1);

        expect(html.indexOf('<p>HOMEPAGE PATH: /de/</p>')).not.toBe(-1);
        expect(html.indexOf('<p>HOMEPAGE DE_PATH: /de/</p>')).not.toBe(-1);
        expect(html.indexOf('<p>HOMEPAGE EN_PATH: /</p>')).not.toBe(-1);
    });
});

test('Translation EN', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'translation.html'), { encoding: 'utf8' }).then((html) => {
        expect(html.indexOf('<p>TITLE: Title</p>')).not.toBe(-1);
        expect(html.indexOf('<p>CATEGORY: Category</p>')).not.toBe(-1);

        // Missing translation file
        expect(html.indexOf('<p>TITLE 2: Test 2</p>')).not.toBe(-1);

        // Missing translations just produce same string
        expect(html.indexOf('<p>MISSING: missing</p>')).not.toBe(-1);
        expect(html.indexOf('<p>INVALID_GROUP: invalid_group</p>')).not.toBe(-1);
        expect(html.indexOf('<p>MISSING_ATTRIBUTES: missing_attributes</p>')).not.toBe(-1);
    });
});

test('Translation DE', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'de/translation.html'), { encoding: 'utf8' }).then((html) => {
        expect(html.indexOf('<p>TITLE: Titel</p>')).not.toBe(-1);
        expect(html.indexOf('<p>CATEGORY: Kategorie</p>')).not.toBe(-1);

        // Missing translation file
        expect(html.indexOf('<p>TITLE 2: title</p>')).not.toBe(-1);
    });
});
