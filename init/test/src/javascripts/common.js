/**
 * Shared file entry point
 */

console.log('Shared file loaded');

const config = {
    a: {
        b: 'c',
    },
};

console.log(config?.a?.b);
