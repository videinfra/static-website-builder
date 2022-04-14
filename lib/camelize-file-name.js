/**
 * Camelize filename
 *
 * @param {string} str File name
 * @returns {string} Camelized name
 */
module.exports = function camelizeFileName (str) {
    return str
         // Remove extension
        .replace(/(.+?)\..*$/ig, '$1')
        // Remove dot
        .replace(/\./g, '')
        // Replace non alpha-numeric characters
        .replace(/[^a-z0-9]/ig, ' ')
        // Uppercase words
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
             return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        // Remove empty spaces
        .replace(/\s+/g, '');
}
