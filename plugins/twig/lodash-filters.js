exports.preprocess = {
    html: [
        function lodashFiltersPlugin (config) {
            const filters = require('./lodash-filters/filters');

            // Add filters to TWIG configurtion
            config.twig = config.twig || {};
            config.twig.filters = config.twig.filters || [];
            config.twig.filters = config.twig.filters.concat(filters);

            return config;
        }
    ]
};
