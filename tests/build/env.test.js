import path from 'path';
import { fileURLToPath } from 'node:url';
import fsPromises from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.resolve(__dirname, 'public');

test('.env and .env.local files loaded', () => {
    return Promise.all([
        fsPromises.readFile(path.resolve(publicPath, 'assets/javascripts/main.js'), { encoding: 'utf8' }).then((js) => {
            expect(js.indexOf('console.log(`env.host ==`,`https://test-local.tld`)')).not.toBe(-1);
            expect(js.indexOf('console.log(`env.foo ==`,`foo-global`)')).not.toBe(-1);
            expect(js.indexOf('console.log(`env.bar ==`,`bar-local`)')).not.toBe(-1);
            expect(js.indexOf('console.log(`env.typeBoolTrue ==`,!0)')).not.toBe(-1);
            expect(js.indexOf('console.log(`env.typeBoolFalse ==`,!1)')).not.toBe(-1);
            expect(js.indexOf('console.log(`env.typeNumber ==`,123.456)')).not.toBe(-1);
            expect(js.indexOf('console.log(`env.nonExisting ==`,``)')).not.toBe(-1);
        }),
        fsPromises.readFile(path.resolve(publicPath, 'env.html'), { encoding: 'utf8' }).then((html) => {
            expect(html.indexOf('<p>HOST: https://test-local.tld</p>')).not.toBe(-1);
            expect(html.indexOf('<p>TYPE_BOOL_TRUE: pass</p>')).not.toBe(-1);
            expect(html.indexOf('<p>TYPE_BOOL_FALSE: pass</p>')).not.toBe(-1);
            expect(html.indexOf('<p>TYPE_NUMBER: 123.456</p>')).not.toBe(-1);
            expect(html.indexOf('<p>NON_EXISTING:</p>')).not.toBe(-1);
        }),
        fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/env-test.css'), { encoding: 'utf8' }).then((css) => {
            expect(css.indexOf('.env-test:before{content:"https://test-local.tld"}')).not.toBe(-1);
            expect(css.indexOf('--env-test-bool-true:true')).not.toBe(-1);
            expect(css.indexOf('--env-test-bool-false:false')).not.toBe(-1);
            expect(css.indexOf('--env-test-type-number:123.456')).not.toBe(-1);
            expect(css.indexOf('--env-test-type-empty:""')).not.toBe(-1);
            expect(css.indexOf('--env-test-non-existing:""')).not.toBe(-1);
        }),
    ]);
});

test('process.env available in html/data', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'env.html'), { encoding: 'utf8' }).then((html) => {
        expect(html.indexOf('<p>HOST FROM GLOBAL JS: https://test-local.tld</p>')).not.toBe(-1);
    });
});
