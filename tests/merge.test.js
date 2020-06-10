const merge = require('../lib/merge');

test('Merge arrays', () => {
    const obj1 = {'arr': ['a', 'b', {'c': 1, 'd': 2}]};
    const obj2 = {'arr': ['d', 'e', {'d': 3, 'f': 4}]};

    expect(merge(obj1, obj2)).toEqual(
        {'arr': ['a', 'b', {'c': 1, 'd': 2}, 'd', 'e', {'d': 3, 'f': 4}]}
    );
});
