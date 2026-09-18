const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');

app.use('/', routes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
