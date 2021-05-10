module.exports = (card) => {
    card = card.replace(/Take That, Smartypants/, 'Take that, Smartypants');
    card = card.replace(/Help From Future Self/, 'Help from Future Self');
    card = card.replace(/''/g, "'");
    card = card.replace(/'/g, '’');
    card = card.replace(/“/g, '"');
    card = card.replace(/”/g, '"');
    return card;
};
