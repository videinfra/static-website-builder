const prepositions = [
    'about', 'above', 'across', 'after', 'against', 'along', 'amid', 'among', 'around', 'as', 'at', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'by', 'concerning', 'despite', 'down', 'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding', 'round', 'since', 'through', 'throughout', 'to', 'toward', 'towards', 'under', 'underneath', 'until', 'unto', 'up', 'upon', 'with', 'within', 'without', 'a', 'an', 'the',
    'в', 'на', 'по', 'к', 'у', 'от', 'из', 'с', 'над', 'под', 'при', 'без', 'до', 'для', 'за', 'через', 'перед', 'около', 'вокруг', 'о', 'об', 'обо', 'про', 'среди', 'между', 'ради', 'вдоль', 'вне', 'кроме', 'сквозь', 'вследствие', 'благодаря', 'согласно', 'вопреки', 'вроде', 'насчёт', 'касательно', 'со', 'против', 'во', 'ко', 'ото', 'изо', 'надо', 'подо', 'передо', 'передо', 'из-за', 'чтобы', 'когда', 'его', 'которое', 'как', 'и', 'ей', 'они', 'мы', 'или', 'всё', 'я', 'которое', 'вашей', 'эти', 'что', 'вам', 'не уверены', 'а', 'вы', 'этим', 'вашим', 'все', 'если', 'о которой', 'в этом', 'но', 'которые', 'же', 'ваш', 'этой'
];


// Word boundary regex
//     (?<=         # Lookbehind, but don't consume
//     (^|          # Start of string or
//     [^\\p{L}]    # Non-letter, works with unicode characters too
const regexWordBoundary = '(?<=(^|[^\\p{L}]))';
const regexEscape = /[.*+?^${}()|[\]\\]/g;
const regexSplitTags = /<[^>]+>/ug;

const regexMdash = /\s+—/uig;
const regexNdash = /\s+–/uig;
const regexHyphen = /\s+-/uig; // actual hyphen from keyboard
const regexHyphen2 = /\s+‐/uig;
const regexFigureDash = /\s+‒/uig;

const regexMdashEntity = /\s+&mdash;/uig;
const regexNdashEntity = /\s+&ndash;/uig;
const regexHyphenEntity = /\s+&#45;/uig;
const regexHyphen2Entity = /\s+&hyphen;/uig;
const regexFigureDashEntity = /\s+&#x2012;/uig;
const regexDashEntity = /\s+&dash;/uig;

let prepositionsRegex = null;

function escapeRegExp(string) {
    return string.replace(regexEscape, '\\$&'); // $& means the whole matched string
}

function prepositionNbsp(text) {
    if (!text) {
        return '';
    }

    if (!prepositionsRegex) {
        const prepositionsEscaped = prepositions.map(preposition => escapeRegExp(preposition));
        prepositionsRegex = new RegExp(`${regexWordBoundary}(${prepositionsEscaped.join('|')})\\s+`, 'uig');
    }

    // Split text into regular text and HTML tags
    const textTags = text.match(regexSplitTags) || [];
    const textNoTags = text.split(regexSplitTags);

    // Replace prepositions in regular text
    for (let i = 0; i < textNoTags.length; i++) {
        let textPart = textNoTags[i];

        // Replace prepositions with non-breaking space
        textPart = textPart.replace(prepositionsRegex, '$2&nbsp;');

        textPart = textPart.replace(regexMdash, '&nbsp;&mdash;', textPart);
        textPart = textPart.replace(regexNdash, '&nbsp;&ndash;', textPart);
        textPart = textPart.replace(regexHyphen, '&nbsp;&#45;', textPart);
        textPart = textPart.replace(regexHyphen2, '&nbsp;&hyphen;', textPart);
        textPart = textPart.replace(regexFigureDash, '&nbsp;&#x2012;', textPart);

        textPart = textPart.replace(regexMdashEntity, '&nbsp;&mdash;', textPart);
        textPart = textPart.replace(regexNdashEntity, '&nbsp;&ndash;', textPart);
        textPart = textPart.replace(regexHyphenEntity, '&nbsp;&#45;', textPart);
        textPart = textPart.replace(regexHyphen2Entity, '&nbsp;&hyphen;', textPart);
        textPart = textPart.replace(regexFigureDashEntity, '&nbsp;&#x2012;', textPart);
        textPart = textPart.replace(regexDashEntity, '&nbsp;&dash;', textPart);

        textNoTags[i] = textPart;
    }

    // Iterate over regular text and and join back together with tags
    return textNoTags.map((text, index) => {
        return text + (textTags[index] || '');
    }).join('');
}

export default prepositionNbsp;
