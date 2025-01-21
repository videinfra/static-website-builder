const sassStingify = require('../vendor/gulp-sass/sass-stringify');

test('SASS stringify boolean', () => {
    expect(sassStingify(true)).toEqual('true');
    expect(sassStingify(false)).toEqual('false');
});

test('SASS stringify number', () => {
    expect(sassStingify(0)).toEqual('0');
    expect(sassStingify(-123)).toEqual('-123');
    expect(sassStingify(123.456)).toEqual('123.456');
});

test('SASS stringify falsy', () => {
    expect(sassStingify(null)).toEqual('false');
    expect(sassStingify(undefined)).toEqual('false');
});

test('SASS stringify object', () => {
    const obj1 = {env: {key1: 'value1', key2: null, key3: undefined, arr: ['a', 123, true] }};
    const out1 = "$env: (key1: 'value1', key2: false, key3: false, arr: ('a',123,true));";

    expect(sassStingify(obj1)).toEqual(out1);
});
