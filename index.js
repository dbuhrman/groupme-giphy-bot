'use strict';

require('./globals');

const express = require('express'),
    https = require('https'),
    bodyParser = require('body-parser'),
    giphyApi = require('giphy-api')(),
    app = express();

// JSON parser middleware
app.use(bodyParser.json());

// Ping
app.get('/', (req, res) => {
    if(req.query && req.query.q) {
        giphyApi.search(req.query.q).then(giphys => {
            if(giphys.data && giphys.data.length > 0) {
                const randomGif = giphys.data[Math.floor(Math.random() * giphys.data.length)];
                sendBotMessage(`http://i.giphy.com/${randomGif.id}.gif`);
                res.sendStatus(200);
            } else {
                res.send('No gifs returned.');
            }
        }).catch(err => {
            res.status(400).send(`Error with giphy API: ${err}`);
        });
    } else {
        res.send("I'm alive!!! WHHAHHAHAH");
    }
});

// Groupme messages handler
app.post('/', (req, res) => {
    console.log('Received groupme message', req.body);

    // Don't care about this message, move-on with our lives.
    const textMatch = req.body.match(/^giphy (.*)$/);
    if(req.body.sender_type === 'bot' || !textMatch) return res.sendStatus(200);

    giphyApi.search(textMatch[1]).then(giphys => {
        if(giphys.data && giphys.data.length > 0) {
            const randomGif = giphys.data[Math.floor(Math.random() * giphys.data.length)];
            sendBotMessage(`http://i.giphy.com/${randomGif.id}.gif`);
        } else {
            sendBotMessage(`No giphys found for search ${textMatch[1]}. :'(`);
        }

        res.sendStatus(200);
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

const sendBotMessage = text => {
    const body = { bot_id: BOT_ID, text};
    console.log('Sending bot post request: ', body);
    https.request({
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        method: 'POST'
    }, res => {
        console.log('Status code response from groupme post: ', res && res.statusCode);
    }).on('error', err => {
        console.error('Error from groupme post: ', err);
    }).on('timeout', err => {
        console.error('Timeout from groupme post:', err);
    }).end(JSON.stringify(body));
};