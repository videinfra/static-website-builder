import fs from 'node:fs';

export default function rawPlugin() {
    return {
        name: 'raw',
        load: {
            filter: {
                id: /\?raw$/,
            },
            handler(id) {
                const content = fs.readFileSync(id.replace('?raw', '')).toString('utf-8');
                return `export default \`${content.replace(/`/g, '\\`')}\``;

            }
        },
    };
}
