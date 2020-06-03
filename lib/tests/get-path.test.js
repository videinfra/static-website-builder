const path = require('../get-path');

// normalizeGlob
test('normalizeGlob unix path', () => {
    const input = '/some/folder';
    const output = path.normalizeGlob(input);
    expect(output).toBe(input);
});

test('normalizeGlob windows path', () => {
    const output = path.normalizeGlob('I:\\\\some\\folder\\');
    expect(output).toBe('I://some/folder/');
});

test('normalizeGlob with array', () => {
    const output = path.normalizeGlob([
        '/some/folder',
        'I:\\\\some\\folder\\'
    ]);

    expect(output).toEqual([
        '/some/folder',
        'I://some/folder/'
    ]);
});

// getGlobPaths
test('getGlobPaths single windows path', () => {
    expect(path.getGlobPaths('I:\\\\some\\folder')).toEqual(
        ['I://some/folder/**']
    );
});

test('getGlobPaths single path without extension', () => {
    expect(path.getGlobPaths('/some/folder')).toEqual(
        ['/some/folder/**']
    );
});

test('getGlobPaths single path with string extension', () => {
    expect(path.getGlobPaths('/some/folder', 'jpg')).toEqual(
        ['/some/folder/**/*.jpg']
    );
});

test('getGlobPaths single path with array of extensions', () => {
    expect(path.getGlobPaths('/some/folder', ['jpg', 'gif'])).toEqual(
        ['/some/folder/**/*.{jpg,gif}']
    );
});

test('getGlobPaths array of paths without extension', () => {
    expect(path.getGlobPaths(['/some/folder', '/some/other/folder'])).toEqual(
        ['/some/folder/**','/some/other/folder/**']
    );
});

test('getGlobPaths array of paths with string extension', () => {
    expect(path.getGlobPaths(['/some/folder', '/some/other/folder'], 'jpg')).toEqual(
        ['/some/folder/**/*.jpg', '/some/other/folder/**/*.jpg']
    );
});

test('getGlobPaths array of paths with array of extensions', () => {
    expect(path.getGlobPaths(['/some/folder', '/some/other/folder'], ['jpg', 'gif'])).toEqual(
        ['/some/folder/**/*.{jpg,gif}', '/some/other/folder/**/*.{jpg,gif}']
    );
});

test('getGlobPaths array of windows paths with array of extensions', () => {
    expect(path.getGlobPaths(['I:\\\\some\\folder', 'I:\\\\some\\other\\folder'], ['jpg', 'gif'])).toEqual(
        ['I://some/folder/**/*.{jpg,gif}', 'I://some/other/folder/**/*.{jpg,gif}']
    );
});
