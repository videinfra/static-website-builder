import filters from './lodash-filters/filters.js';

export const preprocess = {
    html: [
        function lodashFiltersPlugin (config) {
            // Add filters to TWIG configurtion
            config.twig = config.twig || {};
            config.twig.filters = config.twig.filters || [];
            config.twig.filters = config.twig.filters.concat(filters);

            return config;
        }
    ]
};
