module.exports = function sassStingify (data, isDeep = false) {
    if (data === null || data === undefined) {
        return 'false';
    } else if (data !== '' && (data === 'true' || data === 'false' || data === true || data === false || !isNaN(data))) {
        // Convert to simple value
        return String(data);
    } else if (Array.isArray(data)) {
        const out = data.map((item) => sassStingify(item, true));
        return `(${ out })`;
    } else if (data && typeof data === 'object') {
        const out = [];
        for (let key in data) {
            out.push(`${key}: ${sassStingify(data[key], true)}`);
        }

        if (out.length) {
            if (isDeep) {
                return `(${ out.join(', ') })`;
            } else {
                return `$${ out.join(';$') };`;
            }
        } else {
            return '';
        }
    } else {
        // Convert to string
        return "'" + data.toString()
            .replace(/\\/g, '\\\\')
            .replace(/'/g, '\\\'')
            .replace(/\n/g, '\\n') + "'";
    }
};
