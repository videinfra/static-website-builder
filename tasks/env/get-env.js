const paths = require('../../lib/get-path');
const dotenv = require('dotenv');
const getConfig = require('../../lib/get-config');

function escapeJSVariable (value) {
    if (value === 'true' || value === 'false' || value === true || value === false || !isNaN(value)) {
        return value;
    } else {
        // Convert to string
        return "'" + value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\n/g, '\\n') + "'";
    }
}

function normalizeTwigVariable (value) {
    if (value === 'true') {
        return true;
    } else if (value === 'false') {
        return false;
    } else if (value !== '' && !isNaN(value)) {
        return parseFloat(value);
    } else {
        return value;
    }
}

function getEnvData () {
    const envVariables = {};
    const twigVariables = {};
    const scssVariables = { env: { _tmp: 1 } }; // _tmp is used to avoid SCSS error if object is empty
    const jsVariables = {};
    const envOutVariables = {};

    const envFiles = paths.getPathConfig().env.map((path) => paths.getProjectPath(path));

    dotenv.config({
        // dotenv file order is reversed, values in first file overwrite all other
        // file values
        path: envFiles.reverse(),
        processEnv: envVariables,
        quiet: true,
    });

    // Remap property names
    const map = getConfig.getTaskConfig('env', 'map');

    Object.keys(map).forEach(key => {
        if (key in envVariables) {
            const value = envVariables[key];
            const camelCase = map[key];
            const kebabCase = map[key];
            twigVariables[camelCase] = normalizeTwigVariable(value);
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
