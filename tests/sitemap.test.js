const path = require('path');
const publicPath = path.resolve(__dirname, 'build', 'public');
const fs = require('fs')
const fsPromises = fs.promises;

test('Sitemap generated, but doesn\'t include 404 page', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'sitemap.xml'), {'encoding': 'utf8'}).then((html) => {
        expect(html.includes('<loc>https://test-local.tld/404.html</loc>')).toBe(false);
    });
});

