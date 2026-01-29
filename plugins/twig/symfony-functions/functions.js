import filters  from '../symfony-filters/filters.js';

function applyFilter (filter) {
    const args = [];

    for (let i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    for (let i = 0; i < filters.length; i++) {
        if (filters[i].name === filter) {
            return filters[i].func.apply(this, args);
        }
    }

    return args[0];
}


/**
 * Symphony asset() TWIG function
 */
export default [
    {
        name: 'asset',
        func: function (path) {
            const normalizedPath = (path || path === 0 ? String(path) : '');
            return applyFilter('version', applyFilter('cdnify', normalizedPath));
        }
    }
];
