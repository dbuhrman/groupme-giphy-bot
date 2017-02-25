'use strict';

const express = require('express'),
      app = express(),
      port = process.env.PORT || 5050;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
