'use strict';

const express = require('express'),
    https = require('https'),
    bodyParser = require('body-parser'),
    giphyApi = require('giphy-api')(),
    groupme = require('groupme').Stateless,
    PORT = process.env.PORT || 5500,
    GROUPME_API_KEY = process.env.GROUPME_API_KEY,
    app = express();

let BOTS = [];

// JSON parser middleware
app.use(bodyParser.json());

// Ping
app.get('/', (req, res) => {
    if(req.query && req.query.q) {
        giphyApi.search(req.query.q).then(giphys => {
            if(giphys.data && giphys.data.length > 0) {
                const randomGif = giphys.data[Math.floor(Math.random() * giphys.data.length)];
                res.send(`http://i.giphy.com/${randomGif.id}.gif`);
            } else {
                res.send('No gifs returned.');
            }
        }).catch(err => {
            res.status(400).send(`Error with giphy API: ${err}`);
        });
    } else {
        refreshGroupmeBots().then(res.send.bind(res, "I'm alive!!! WHHAHHAHAH"));
    }
});

// Groupme messages handler
app.post('/', (req, res) => {
    console.log('Received groupme message', req.body);

    // Don't care about this message, move-on with our lives.
    const textMatch = req.body.text.match(/^giphy (.*)$/i);
    if(req.body.sender_type === 'bot' || !textMatch || !BOTS[req.body.group_id]) {
        console.log(BOTS, req.body.group_id, BOTS[req.body.group_id]);
        return res.sendStatus(200);
    }

    giphyApi.search(textMatch[1]).then(giphys => {
        if(giphys.data && giphys.data.length > 0) {
            const randomGif = giphys.data[Math.floor(Math.random() * giphys.data.length)];
            sendBotMessage(BOTS[req.body.group_id], `http://i.giphy.com/${randomGif.id}.gif`);
        } else {
            sendBotMessage(BOTS[req.body.group_id], `No giphys found for search ${textMatch[1]}. :'(`);
        }

        res.sendStatus(200);
    });
});

const refreshGroupmeBots = () => {
    return groupme.Bots.index.Q(GROUPME_API_KEY)
        .then(bots => {
            BOTS = bots.filter(b => b.name.toLowerCase() === 'giphy')
                .reduce((res, b) => {
                    res[b.group_id] = b.bot_id;
                    return res;
                }, {});
        })
        .catch(err => {
            console.error('Error refreshing groupme bots: ', err);
        })
};

/**
 * Send a message to groupme as a bot
 * @param bot_id ID of the bot to send message as.
 * @param text Content of the message.
 */
const sendBotMessage = (bot_id, text) => {
    const body = { bot_id, text };
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

// Startup express.js server.
refreshGroupmeBots().then(() => {
    console.log(BOTS);
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
});