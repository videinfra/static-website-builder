const path = require('path');
const publicPath = path.resolve(__dirname, 'public');
const fs = require('fs')
const fsPromises = fs.promises;


test('TWIG templates rendered and minified with JS and JSON data', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'index.html'), {'encoding': 'utf8'}).then((html) => {
        expect(html).toBe('<html><body><h1>Hello World!</h1></body></html>');
    });
});

test('Multiple TWIG templates rendered', () => {
    expect.assertions(1);
    return expect(fsPromises.access(path.resolve(publicPath, 'other.html'))).resolves.toBe(undefined);
});

test('SASS variable test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/variable-test.css'), {'encoding': 'utf8'}).then((css) => {
        expect(css).toBe('main{background:#fff;color:#222}');
    });
});

test('SASS import test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/import-test.css'), {'encoding': 'utf8'}).then((css) => {
        expect(css).toBe('.btn{color:#fff;background:#222}');
    });
});

test('SASS sub-folder import test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/sub-folder/import-test.css'), {'encoding': 'utf8'}).then((css) => {
        expect(css).toBe('.btn{color:#fff;background:#222}');
    });
});

test('SASS autoprefixer test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/autoprefixer-test.css'), {'encoding': 'utf8'}).then((css) => {
        expect(css).toBe('main{-webkit-clip-path:polygon(0 0,100% 0,100% 100%,0 100%);clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}');
    });
});

test('Font file woff copied', () => {
    expect.assertions(1);
    return expect(fsPromises.access(path.resolve(publicPath, 'assets/fonts/font.woff'))).resolves.toBe(undefined);
});

test('Font file fake not copied', () => {
    expect.assertions(1);
    return expect(fsPromises.access(path.resolve(publicPath, 'assets/fonts/font.fake'))).rejects.toThrow('no such file or directory');
});

test('shared.js file exists', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/shared.js'), {'encoding': 'utf8'}).then((js) => {
        expect(js.indexOf('console.log("Shared file loaded")')).not.toBe(-1);
    });
});

test('other.js file exists', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/other.js'), {'encoding': 'utf8'}).then((js) => {
        expect(js.indexOf('console.log("Hello from other page!")')).not.toBe(-1);
    });
});

test('main.js file exists', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/main.js'), {'encoding': 'utf8'}).then((js) => {
        expect(js.indexOf('console.log("Hello from main page!")')).not.toBe(-1);
    });
});

test('icons generated', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/images/icons.svg'), {'encoding': 'utf8'}).then((svg) => {
        expect(svg.indexOf('<symbol id="example-arrow">')).not.toBe(-1);
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
