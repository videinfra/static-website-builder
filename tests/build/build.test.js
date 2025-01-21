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
        expect(css).toBe('.btn{background:#222;color:#fff}');
    });
});

test('SASS sub-folder import test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/sub-folder/import-test.css'), {'encoding': 'utf8'}).then((css) => {
        expect(css).toBe('.btn{background:#222;color:#fff}');
    });
});

test('SASS autoprefixer test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/autoprefixer-test.css'), {'encoding': 'utf8'}).then((css) => {
        expect(css).toBe('main{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}');
    });
});

test('CSS nano ignore test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/ignore-test.css'), {'encoding': 'utf8'}).then((css) => {
        expect(css).toBe(':root{--yes: ;--no:initial}');
    });
});

test('CSS nano nested calc test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/nested-calc-test.css'), {'encoding': 'utf8'}).then((css) => {
        expect(css).toBe('body{padding-top:calc(10vw + (10vh * 1.5))}');
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
    return Promise.all([
        fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/shared.js'), {'encoding': 'utf8'}).then((js) => {
            expect(js.indexOf('console.log("Shared file loaded")')).not.toBe(-1);
        }),
        fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/alt/shared.js'), {'encoding': 'utf8'}).then((js) => {
            expect(js.indexOf('console.log("Shared file loaded")')).not.toBe(-1);
        }),
    ]);
});

test('main.js file exists', () => {
    return Promise.all([
        fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/main.js'), {'encoding': 'utf8'}).then((js) => {
            expect(js.indexOf('console.log("Hello from main page!")')).not.toBe(-1);
        }),
        fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/alt/main.js'), {'encoding': 'utf8'}).then((js) => {
            expect(js.indexOf('console.log("Hello from main page!")')).not.toBe(-1);
        }),
    ]);
});

test('other.js file exists', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/other.js'), {'encoding': 'utf8'}).then((js) => {
        expect(js.indexOf('console.log("Hello from other page!")')).not.toBe(-1);
    });
});

test('alt/other.js file doesn\'t exist', async () => {
    expect(fsPromises.stat(path.resolve(publicPath, 'assets/javascripts/alt/other.js'))).rejects.toThrow();
});

test('.env and .env.local files loaded', () => {
    return Promise.all([
        fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/main.js'), {'encoding': 'utf8'}).then((js) => {
            expect(js.indexOf('console.log("env.host ==","https://test-local.tld")')).not.toBe(-1);
            expect(js.indexOf('console.log("env.foo ==","foo-global")')).not.toBe(-1);
            expect(js.indexOf('console.log("env.bar ==","bar-local")')).not.toBe(-1);
        }),
        fsPromises.readFile(path.resolve(publicPath, 'env.html'), {'encoding': 'utf8'}).then((html) => {
            expect(html.indexOf('<p>HOST: https://test-local.tld</p>')).not.toBe(-1);
        }),
        fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/env-test.css'), {'encoding': 'utf8'}).then((css) => {
            expect(css.indexOf('.env-test:before{content:"https://test-local.tld"}')).not.toBe(-1);
        }),
    ]);
});

test('process.env available in html/data', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'env.html'), {'encoding': 'utf8'}).then((html) => {
        expect(html.indexOf('<p>HOST FROM GLOBAL JS: https://test-local.tld</p>')).not.toBe(-1);
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
