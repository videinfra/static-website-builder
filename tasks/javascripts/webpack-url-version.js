/**
 * Plugin which adds to the dynamically imported JS files a version string at the end
 * which is the same as for original file name.
 */
module.exports = class WebpackURLVersioningPlugin {
    apply(compiler) {
        compiler.hooks.afterPlugins.tap('URLVersioning', () => {
            compiler.hooks.thisCompilation.tap('URLVersioning', compilation => {
                const mainTemplate = compilation.mainTemplate;

                if (mainTemplate.hooks.localVars) {
                    mainTemplate.hooks.localVars.tap('URLVersioning',(source, _chunk, _hash) => {
                        if (source.indexOf('var version = ') === -1) {
                            const startString = 'function jsonpScriptSrc(chunkId) {';
                            const endString = '+ ".js"';
                            const start = source.indexOf(startString);
                            const end = start !== -1 ? source.indexOf(endString, start) : -1;

                            if (start !== -1) {
                                const offset = end + endString.length;
                                return 'var version = document.currentScript.src && document.currentScript.src.match(/\\?.*/);' + source.substr(0, offset) + ' + (version ? version[0] : "")' + source.substr(offset);
                            }
                        }

                        return source;
                    });
                }
            });
        });

    }
}
