const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

app.get('/', (req, res) => {
  res.send('E-Commerce API running');
});

module.exports = app;
