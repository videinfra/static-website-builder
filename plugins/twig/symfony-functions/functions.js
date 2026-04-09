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
    },

    // Fake "path" filter, it tries to replicate Symfony's path() function
    {
        name: 'path',
        func: function (path, args) {
            // Find locale information
            const locale = args?._locale || this.context.app.request.locale;
            const defaultLocale = this.context.app.request.defaultLocale;
            const pathPrefix = locale === defaultLocale ? '' : `/${locale}`;

            if (path === 'app.homepage') {
                return `${pathPrefix}/`;
            } else if (path.startsWith('app.')) {
                return `${pathPrefix}/${path.slice(4).replace(/_/g, '-')}`;
            } else {
                return `${pathPrefix}${path}`;
            }
        },
    },
];
