import path from 'path';
import { fileURLToPath } from 'node:url';
import fsPromises from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.resolve(__dirname, 'build', 'public');

test("Sitemap generated, but doesn't include 404 page", () => {
    return fsPromises.readFile(path.resolve(publicPath, 'sitemap.xml'), { encoding: 'utf8' }).then((html) => {
        expect(html.includes('<loc>https://test-local.tld/404.html</loc>')).toBe(false);
    });
});
