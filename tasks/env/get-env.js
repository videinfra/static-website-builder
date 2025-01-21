const paths = require('../../lib/get-path');
const dotenv = require('dotenv');
const getConfig = require('../../lib/get-config');

function escapeJSVariable (value) {
    if (value === true || value === false || !isNaN(value)) {
        return value;
    } else {
        // Convert to string
        return "'" + value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\n/g, '\\n') + "'";
    }
}

function getEnvData () {
    const envVariables = {};
    const twigVariables = {};
    const scssVariables = { env: {} };
    const jsVariables = {};
    const envOutVariables = {};

    const envFiles = paths.getPathConfig().env.map((path) => paths.getProjectPath(path));

    dotenv.config({
        // dotenv file order is reversed, values in first file overwrite all other
        // file values
        path: envFiles.reverse(),
        processEnv: envVariables
    });

    // Remap property names
    const map = getConfig.getTaskConfig('env', 'map');

    Object.keys(map).forEach(key => {
        if (key in envVariables) {
            const value = envVariables[key];
            const camelCase = map[key];
            const kebabCase = map[key].replace(/([a-z])([A-Z])/g, '$1-$2').replace(/_([a-z])/ig, '-$1').toLowerCase();
            twigVariables[camelCase] = value;
            envOutVariables[camelCase] = value;
            jsVariables[`process.env.${ camelCase }`] = escapeJSVariable(value);
            scssVariables.env[kebabCase] = value;
        }
    });

    return {
        twig: twigVariables,
        sass: scssVariables,
        js: jsVariables,
        env: envOutVariables,
    }
}

module.exports = getEnvData;
