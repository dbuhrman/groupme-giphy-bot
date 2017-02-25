'use strict';

const fs = require('fs'),
    path = require('path'),
    secretsFile = path.join(__dirname, 'secrets.json');

// Use secrets.json locally, but deployed app use env vars.
try {
    const secrets = JSON.parse(fs.readFileSync(secretsFile, 'utf-8'));
    Object.assign(global, secrets);
} catch(err) {
    global.BOT_ID = process.env.BOT_ID;
}

global.PORT = process.env.PORT || 5500;
