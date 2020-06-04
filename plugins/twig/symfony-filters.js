exports.preprocess = {
    html: [
        function symfonyFiltersPlugin  (config) {
            const filters = require('./symfony-filters/filters');

            // Add filters to TWIG configurtion
            config.twig = config.twig || {};
            config.twig.filters = config.twig.filters || [];
            config.twig.filters = config.twig.filters.concat(filters);

            return config;
        }
    ]
};
