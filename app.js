const express = require('express');
const app = express();
const usersRouter = require('./routes/users');

app.use(express.json());
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.send('E-Commerce API running');
});

module.exports = app;
