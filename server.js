require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');
const { initDb } = require('./database');

app.use('/', routes);

initDb()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
