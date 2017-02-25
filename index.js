'use strict';

require('./globals');

const express = require('express'),
    https = require('https'),
    bodyParser = require('body-parser'),
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

    if(req.body.sender_type !== 'bot') {
        const botRequest = https.request({
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST'
        }, res => {
            console.log('Status code response from groupme post: ', res && res.statusCode);
        });

        const body = {
            bot_id: BOT_ID,
            text: req.body.text
        };

        botRequest.on('error', err => {
            console.error('Error from groupme post: ', err);
        }).on('timeout', err => {
            console.error('Timeout from groupme post:', err);
        }).end(JSON.stringify(body));
    }

    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
