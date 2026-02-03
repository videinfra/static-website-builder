import fs from 'node:fs';
import dotenv from 'dotenv';
import nanomemoize from 'nano-memoize';
import { getPathConfig, getProjectPath } from '../../lib/get-path.js';
import { getTaskConfig } from '../../lib/get-config.js';

function escapeJSVariable(value) {
    if (value === 'true' || value === 'false' || value === true || value === false || !isNaN(value)) {
        return value;
    } else {
        // Convert to string
        return "'" + value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
    }
}

function normalizeTwigVariable(value) {
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

/**
 * Write asset version to the env file
 * @param {string} assetVersion Asset version string
 */
function writeEnvFileAssetVersion(assetVersion) {
    const envFilePath = getTaskConfig('env', 'writeAssetVersion');
    if (envFilePath) {
        const envFile = getProjectPath(envFilePath);

        try {
            let envContent = fs.readFileSync(envFile, 'utf8');

            // Replace ASSETS_VERSION if it exists
            if (envContent.includes('ASSETS_VERSION=')) {
                envContent = envContent.replace(/ASSETS_VERSION=.*/, `ASSETS_VERSION=${assetVersion}`);
            } else {
                envContent += `\nASSETS_VERSION=${assetVersion}`;
            }

            fs.writeFileSync(envFile, envContent);
        } catch (error) {
            console.error(`Error writing env file "${envFile}"`, error);
        }
    }
}

/**
 * Load data from the .env files
 * @returns {object} List of environment variables
 */
export const loadEnvData = nanomemoize.nanomemoize(function () {
    const envVariables = {};
    const envFiles = getPathConfig().env.map((path) => getProjectPath(path));

    dotenv.config({
        // dotenv file order is reversed, values in first file overwrite all other
        // file values
        path: envFiles.reverse(),
        processEnv: envVariables,
        quiet: true,
    });

    // Set assets version if it doesn't exist
    if (!envVariables['ASSETS_VERSION'] || getTaskConfig('env', 'writeAssetVersion')) {
        envVariables['ASSETS_VERSION'] = String(Math.floor(Date.now() / 1000));
        writeEnvFileAssetVersion(envVariables['ASSETS_VERSION']);
    }

    return envVariables;
});

/**
 * Returns environment variables mapped to the specified names
 * @returns {object} Mapped environment variables
 */
const getEnvData = nanomemoize.nanomemoize(function () {
    const envVariables = loadEnvData();
    const twigVariables = {};
    const scssVariables = { env: { _tmp: 1 } }; // _tmp is used to avoid SCSS error if object is empty
    const jsVariables = {};
    const envOutVariables = {};

    // Remap property names
    const map = getTaskConfig('env', 'map');

    Object.keys(map).forEach((key) => {
        if (key in envVariables) {
            const value = envVariables[key];
            const camelCase = map[key];
            const kebabCase = map[key];
            twigVariables[camelCase] = normalizeTwigVariable(value);
            envOutVariables[camelCase] = value;
            jsVariables[`process.env.${camelCase}`] = escapeJSVariable(value);
            scssVariables.env[kebabCase] = value;
        }
    });

    return {
        twig: twigVariables,
        sass: scssVariables,
        js: jsVariables,
        env: envOutVariables,
    };
});

export default getEnvData;
