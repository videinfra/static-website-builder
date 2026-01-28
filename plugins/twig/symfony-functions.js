import functions from './symfony-functions/functions.js';

export const preprocess = {
    html: [
        function symfonyFunctionsPlugin(config) {
            // Add functions to TWIG configurtion
            config.twig = config.twig || {};
            config.twig.functions = config.twig.functions || [];
            config.twig.functions = config.twig.functions.concat(functions);

            return config;
        },
    ],
};
