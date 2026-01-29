import filters from './symfony-filters/filters.js';

export const preprocess = {
    html: [
        function symfonyFiltersPlugin(config) {
            // Add filters to TWIG configurtion
            config.twig = config.twig || {};
            config.twig.filters = config.twig.filters || [];
            config.twig.filters = config.twig.filters.concat(filters);

            return config;
        },
    ],
};
