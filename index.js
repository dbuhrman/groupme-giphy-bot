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
    console.log('Received groupme message', req.body);
    request({
        method: 'POST',
        uri: `https://api.groupme.com/v3/bots/post`,
        json: true,
        body: JSON.stringify({
            bot_id: BOT_ID,
            text: req.body.text
        })
    }, (err, res, body) => {
        console.log('Groupme message POST response.');
        if(err) {
            console.error(err);
        } else {
            console.log(`Status code ${res && res.statusCode}`);
            console.log('Body:', body);
        }
    });
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
