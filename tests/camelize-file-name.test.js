const camelizeFileName = require('../lib/camelize-file-name');

test('Camelize file name', () => {
    expect(camelizeFileName('test-file-name')).toBe('testFileName');
    expect(camelizeFileName('testFileName')).toBe('testFileName');
    expect(camelizeFileName('testFile_name')).toBe('testFileName');
    expect(camelizeFileName('test-file-name.jpg')).toBe('testFileName');
    expect(camelizeFileName('testFileName.jpg')).toBe('testFileName');
    expect(camelizeFileName('test-āēūīķļ-name.jpg.png')).toBe('testName');
    expect(camelizeFileName('.gitignore')).toBe('gitignore');
});
