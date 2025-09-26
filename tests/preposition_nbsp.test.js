const path = require('path');
const publicPath = path.resolve(__dirname, 'build', 'public');
const fs = require('fs')
const fsPromises = fs.promises;

const preposition_nbsp = require('../plugins/twig/symfony-filters/preposition_nbsp');

test('preposition_nbsp english', () => {
    expect(preposition_nbsp('hello world')).toEqual('hello world');
    expect(preposition_nbsp('hello at')).toEqual('hello at');
    expect(preposition_nbsp('hello at. world')).toEqual('hello at. world');
    expect(preposition_nbsp('hello at world')).toEqual('hello at&nbsp;world');
    expect(preposition_nbsp('hello before at world')).toEqual('hello before&nbsp;at&nbsp;world');
});

test('preposition_nbsp russian', () => {
    expect(preposition_nbsp('ппппп дддд')).toEqual('ппппп дддд');
    expect(preposition_nbsp('ппппп над')).toEqual('ппппп над');
    expect(preposition_nbsp('ппппп над. дддд')).toEqual('ппппп над. дддд');
    expect(preposition_nbsp('ппппп над дддд')).toEqual('ппппп над&nbsp;дддд');
    expect(preposition_nbsp('ппппп before над дддд')).toEqual('ппппп before&nbsp;над&nbsp;дддд');
});

test('preposition_nbsp hyphens', () => {
    expect(preposition_nbsp('hello — world')).toEqual('hello&nbsp;&mdash; world');
    expect(preposition_nbsp('hello – world')).toEqual('hello&nbsp;&ndash; world');
    expect(preposition_nbsp('hello - world')).toEqual('hello&nbsp;&#45; world');
    expect(preposition_nbsp('hello ‐ world')).toEqual('hello&nbsp;&hyphen; world');
    expect(preposition_nbsp('hello ‒ world')).toEqual('hello&nbsp;&#x2012; world');
    expect(preposition_nbsp('hello &dash; world')).toEqual('hello&nbsp;&dash; world');

    // Don't replace hyphens with entities if not needed
    expect(preposition_nbsp('hello— world')).toEqual('hello— world');

    // Hyphens + prepositions
    expect(preposition_nbsp('hello ‒ at world')).toEqual('hello&nbsp;&#x2012; at&nbsp;world');
});

test('Preposition TWIG filter applied', () => {
    return fsPromises.readFile(path.resolve(publicPath, 'preposition.html'), {'encoding': 'utf8'}).then((html) => {
        expect(html).toBe('<html><body>hello at&nbsp;world</body></html>');
    });
});
