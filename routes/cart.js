const express = require('express');
const router = express.Router();

const {
  createOrGetCart,
  addOrUpdateCartItem,
  getCartContents,
  checkoutCart
} = require('../controllers/cartController');

const { authenticateToken } = require('../middleware/auth');

// Create or get user's cart
router.post('/', authenticateToken, createOrGetCart);

// Add or update item in cart
router.post('/:cartId', authenticateToken, addOrUpdateCartItem);

// Get all items in a cart
router.get('/:cartId', authenticateToken, getCartContents);

//cart checkout
router.post('/:cartId/checkout', authenticateToken, checkoutCart);

module.exports = router;
