const REGEX_FROM = /from "([^"]+)"/g;
const REGEX_IMPORT = /import "([^"]+)"/g;
const REGEX_DYNAMIC_IMPORT = /import\("([^"]+)"/g;

function getImportFileName(file, assetVersion) {
    return `${file}${file.includes('?') ? '&' : '?'}v=${assetVersion}`;
}

export default function versionPlugin(assetVersion) {
    return {
        name: 'version',
        renderChunk(code, chunk) {
            if (assetVersion && chunk.fileName.endsWith('.js')) {
                code = code.replace(REGEX_FROM, (_, file) => {
                    if (!file.includes('?v=') && !file.includes('&v=')) {
                        return `from "${getImportFileName(file, assetVersion)}"`;
                    }
                });
                code = code.replace(REGEX_IMPORT, (_, file) => {
                    if (!file.includes('?v=') && !file.includes('&v=')) {
                        return `import "${getImportFileName(file, assetVersion)}"`;
                    }
                });
                code = code.replace(REGEX_DYNAMIC_IMPORT, (_, file) => {
                    if (!file.includes('?v=') && !file.includes('&v=')) {
                        return `import("${getImportFileName(file, assetVersion)}"`;
                    }
                });

                return code;
            }
        }
    };
}
