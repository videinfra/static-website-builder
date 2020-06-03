exports.preprocess = {
    html: [
        function symfonyFiltersPlugin  (config) {
            const filters = require('./symfony-filters/filters');

            config.twig = config.twig || {};
            config.twig.filters = config.twig.filters || [];
            config.twig.filters = config.twig.filters.concat(filters);

            return config;
        }
    ]
};
