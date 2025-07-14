const express = require('express');
const router = express.Router();
const { getUserOrders, getOrderById } = require('../controllers/ordersController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getUserOrders);
router.get('/:orderId', authenticateToken, getOrderById);

module.exports = router;
