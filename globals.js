'use strict';

const fs = require('fs'),
    path = require('path'),
    secretsFile = path.join(__dirname, 'secrets.json');

globals.secrets = JSON.parse(fs.readFileSync(secretsFile, 'utf-8')));

globals.PORT = process.env.PORT || 5500;
