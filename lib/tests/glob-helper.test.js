const glob = require('../globs-helper');

test('glob normalize unix path', () => {
    const input = '/some/folder';
    const output = glob.paths(input).generate();
    expect(output).toEqual([input]);
});

test('glob normalize windows path', () => {
    const output = glob.paths('I:\\\\some\\folder\\').generate();
    expect(output).toEqual(['I://some/folder/']);
});

test('glob normalize with array', () => {
    const output = glob.paths([
        '/some/folder',
        'I:\\\\some\\folder\\'
    ]).generate();

    expect(output).toEqual([
        '/some/folder',
        'I://some/folder/'
    ]);
});

test('glob path merging', () => {
    const output = glob.paths('/some/folder').paths(['', '/a', '/b']).generate();
    expect(output).toEqual(['/some/folder', '/some/folder/a', '/some/folder/b']);
});

test('glob multi path merging', () => {
    const output = glob.paths(['/some/folder', '/other/folder']).paths(['/a', '/b']).generate();
    expect(output).toEqual(['/some/folder/a', '/some/folder/b', '/other/folder/a', '/other/folder/b']);
});

test('glob filesWithExtensions, without extensions', () => {
    const output = glob.paths('/some/folder').filesWithExtensions().generate();
    expect(output).toEqual(['/some/folder']);
});

test('glob filesWithExtensions, single extension', () => {
    const output = glob.paths('/some/folder').filesWithExtensions('jpg').generate();
    expect(output).toEqual(['/some/folder/**/*.jpg']);
});

test('glob filesWithExtensions, single extension array', () => {
    const output = glob.paths('/some/folder').filesWithExtensions(['jpg']).generate();
    expect(output).toEqual(['/some/folder/**/*.jpg']);
});

test('glob filesWithExtensions, multiple extensions', () => {
    const output1 = glob.paths('/some/folder').filesWithExtensions(['jpg', 'png']).generate();
    expect(output1).toEqual(['/some/folder/**/*.{jpg,png}']);

    const output2 = glob.paths(['/some/folder', '/other/folder']).filesWithExtensions(['jpg', 'png']).generate();
    expect(output2).toEqual(['/some/folder/**/*.{jpg,png}', '/other/folder/**/*.{jpg,png}']);
});


test('glob allFiles', () => {
    const output1 = glob.paths('/some/folder').allFiles().generate();
    expect(output1).toEqual(['/some/folder/**']);

    const output2 = glob.paths(['/some/folder', '/other/folder']).allFiles().generate();
    expect(output2).toEqual(['/some/folder/**', '/other/folder/**']);
});

test('glob allFiles with ignore', () => {
    const output1 = glob.paths('/some/folder').allFiles().ignore().generate();
    expect(output1).toEqual(['!/some/folder/**']);

    const output2 = glob.paths('/some/folder').ignore().allFiles().generate();
    expect(output2).toEqual(['!/some/folder/**']);

    const output3 = glob.paths(['/some/folder', '/other/folder']).ignore().allFiles().generate();
    expect(output3).toEqual(['!/some/folder/**', '!/other/folder/**']);
});

test('glob map', () => {
    const output1 = glob.paths('/some/folder').map((path) => `/a${ path }/b`).generate();
    expect(output1).toEqual(['/a/some/folder/b']);

    const output2 = glob.paths(['/some/folder', '/other/folder']).map((path) => `/a${ path }/b`).generate();
    expect(output2).toEqual(['/a/some/folder/b', '/a/other/folder/b']);
});

test('glob generate', () => {
    const output = glob.generate(
        glob.paths(['/a', '/b']).allFiles(),
        glob.paths(['/c', '/d']).allFiles().ignore(),
    );

    expect(output).toEqual(['/a/**', '/b/**', '!/c/**', '!/d/**']);
});



// getGlobPaths
// test('getGlobPaths single windows path', () => {
//     expect(path.getGlobPaths('I:\\\\some\\folder')).toEqual(
//         ['I://some/folder/**']
//     );
// });

// test('getGlobPaths single path without extension', () => {
//     expect(path.getGlobPaths('/some/folder')).toEqual(
//         ['/some/folder/**']
//     );
// });

// test('getGlobPaths single path with string extension', () => {
//     expect(path.getGlobPaths('/some/folder', 'jpg')).toEqual(
//         ['/some/folder/**/*.jpg']
//     );
// });

// test('getGlobPaths single path with array of extensions', () => {
//     expect(path.getGlobPaths('/some/folder', ['jpg', 'gif'])).toEqual(
//         ['/some/folder/**/*.{jpg,gif}']
//     );
// });

// test('getGlobPaths array of paths without extension', () => {
//     expect(path.getGlobPaths(['/some/folder', '/some/other/folder'])).toEqual(
//         ['/some/folder/**','/some/other/folder/**']
//     );
// });

// test('getGlobPaths array of paths with string extension', () => {
//     expect(path.getGlobPaths(['/some/folder', '/some/other/folder'], 'jpg')).toEqual(
//         ['/some/folder/**/*.jpg', '/some/other/folder/**/*.jpg']
//     );
// });

// test('getGlobPaths array of paths with array of extensions', () => {
//     expect(path.getGlobPaths(['/some/folder', '/some/other/folder'], ['jpg', 'gif'])).toEqual(
//         ['/some/folder/**/*.{jpg,gif}', '/some/other/folder/**/*.{jpg,gif}']
//     );
// });

// test('getGlobPaths array of windows paths with array of extensions', () => {
//     expect(path.getGlobPaths(['I:\\\\some\\folder', 'I:\\\\some\\other\\folder'], ['jpg', 'gif'])).toEqual(
//         ['I://some/folder/**/*.{jpg,gif}', 'I://some/other/folder/**/*.{jpg,gif}']
//     );
// });
