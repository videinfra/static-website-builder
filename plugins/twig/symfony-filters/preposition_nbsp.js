const prepositions = [
    'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'by', 'concerning', 'despite', 'down', 'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding', 'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards', 'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without', 'a', 'an', 'the',
    'в', 'на', 'по', 'к', 'у', 'от', 'из', 'с', 'над', 'под', 'при', 'без', 'до', 'для', 'за', 'через', 'перед', 'около', 'вокруг', 'о', 'об', 'обо', 'про', 'среди', 'между', 'ради', 'вдоль', 'вне', 'кроме', 'сквозь', 'вследствие', 'благодаря', 'согласно', 'вопреки', 'вроде', 'насчёт', 'касательно', 'против', 'со', 'во', 'ко', 'ото', 'изо', 'надо', 'подо', 'передо', 'передо', 'и'
];

// Word boundary regex
//     (?<=         # Lookbehind, but don't consume
//     (^|          # Start of string or
//     [^\\p{L}]    # Non-letter, works with unicode characters too
const regexWordBoundary = '(?<=(^|[^\\p{L}]))';
const regexEscape = /[.*+?^${}()|[\]\\]/g;

let prepositionsRegex = null;

function escapeRegExp(string) {
    return string.replace(regexEscape, '\\$&'); // $& means the whole matched string
}

function prepositionNbsp(text) {
    if (!prepositionsRegex) {
        const prepositionsEscaped = prepositions.map(preposition => escapeRegExp(preposition));
        prepositionsRegex = new RegExp(`${regexWordBoundary}(${prepositionsEscaped.join('|')})\\s+`, 'uig');
    }

    return text.replace(prepositionsRegex, '$2&nbsp;');
}

module.exports = prepositionNbsp;
