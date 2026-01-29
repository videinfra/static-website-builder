/**
 * Virtual entry plugin to generate files from each of the entries in the entry file
 *
 * @param {object} entries Entries object from the entry file
 * @returns {object} Virtual entry plugin
 */
export default function virtualEntryPlugin(entries) {
    const keys = Object.keys(entries);

    return {
        name: 'virtual-entry-plugin', // this name will show up in logs and errors

        resolveId: {
            order: 'post',
            handler(source) {
                if (keys.includes(source)) {
                    return source;
                }
                return null; // other ids should be handled as usual
            },
        },

        load(id) {
            if (keys.includes(id)) {
                return entries[id].map((entry) => `import '${entry}';`).join('\n');
            }
            return null; // other ids should be handled as usual
        },
    };
}
