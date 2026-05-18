import path from 'path';
import { fileURLToPath } from 'node:url';
import fsPromises from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.resolve(__dirname, 'public');

test('Sitemap loc without file extension', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'sitemap.xml'), { encoding: 'utf8' }).then((html) => {
        expect(html.indexOf('<loc>https://test-local.tld/other</loc>')).not.toBe(-1);
    });
});

test('Sitemap alternate hreflang without file extension', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'sitemap.xml'), { encoding: 'utf8' }).then((html) => {
        expect(html.indexOf('<xhtml:link rel="alternate" hreflang="en" href="https://test-local.tld/other" />')).not.toBe(-1);
        expect(html.indexOf('<xhtml:link rel="alternate" hreflang="de" href="https://test-local.tld/de/other" />')).not.toBe(-1);
    });
});


