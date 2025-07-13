const express = require('express');
const router = express.Router();

const {
  createOrGetCart,
  addOrUpdateCartItem,
  getCartContents,
} = require('../controllers/cartController');

const { authenticateToken } = require('../middleware/auth');

// Create or get user's cart
router.post('/', authenticateToken, createOrGetCart);

// Add or update item in cart
router.post('/:cartId', authenticateToken, addOrUpdateCartItem);

// Get all items in a cart
router.get('/:cartId', authenticateToken, getCartContents);

module.exports = router;
