'use strict';

require('./globals');

const express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    app = express();

// JSON parser middleware
app.use(bodyParser.json());

// Ping
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Groupme messages handler
app.post('/', (req, res) => {
    request({
        method: 'POST',
        uri: `https://api.groupme.com/v3/bots/post`,
        json: true,
        body: JSON.stringify({
            bot_id: BOT_ID,
            text: req.body.text
        })
    }, err => {
        if(err) console.error(err);
    });
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
