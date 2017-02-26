'use strict';

// Create BOTS object key-value pars (group_id => bot_id).
// This will be used to determine which bot to send a giphy link to
// based on the source group_id.
global.BOTS = process.env.BOT_IDS.split(';').reduce((res, bot) => {
    const botParts = bot.split('=');
    res[botParts[0]] = botParts[1];
    return res;
}, {});
global.PORT = process.env.PORT || 5500;
