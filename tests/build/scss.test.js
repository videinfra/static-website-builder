import path from 'path';
import { fileURLToPath } from 'node:url';
import fsPromises from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.resolve(__dirname, 'public');

test('SASS variable test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/variable-test.css'), { encoding: 'utf8' }).then((css) => {
        expect(css.startsWith('main{background:#fff;color:#222}')).toBe(true);
    });
});

test('SASS import test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/import-test.css'), { encoding: 'utf8' }).then((css) => {
        expect(css.startsWith('.btn{background:#222;color:#fff}')).toBe(true);
    });
});

test('SASS sub-folder import test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/sub-folder/import-test.css'), { encoding: 'utf8' }).then((css) => {
        expect(css.startsWith('.btn{background:#222;color:#fff}')).toBe(true);
    });
});

test('SASS autoprefixer test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/autoprefixer-test.css'), { encoding: 'utf8' }).then((css) => {
        expect(css.startsWith('main{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}')).toBe(true);
    });
});

test('CSS nano ignore test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/ignore-test.css'), { encoding: 'utf8' }).then((css) => {
        expect(css.startsWith(':root{--yes: ;--no:initial}')).toBe(true);
    });
});

test('CSS nano nested calc test', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/nested-calc-test.css'), { encoding: 'utf8' }).then((css) => {
        expect(css.startsWith('body{padding-top:calc(10vw + 15vh)}')).toBe(true);
    });
});

test('CSS has sourcemap URL', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'assets/stylesheets/nested-calc-test.css'), { encoding: 'utf8' }).then((css) => {
        expect(css.includes('sourceMappingURL=')).toBe(true);
    });
});

test('CSS sourcemap generated', () => {
    expect.assertions(1);
    return expect(fsPromises.access(path.resolve(publicPath, 'assets/stylesheets/nested-calc-test.css.map'))).resolves.toBe(undefined);
});
