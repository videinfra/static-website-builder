exports.preprocess = {
    html: [
        function symfonyFunctionsPlugin (config) {
            const functions = require('./symfony-functions/functions');

            config.twig = config.twig || {};
            config.twig.functions = config.twig.functions || [];
            config.twig.functions = config.twig.functions.concat(functions);

            return config;
        }
    ]
};
