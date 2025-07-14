const express = require('express');
const router = express.Router();
const { 
    getUserOrders, 
    getOrderById, 
    getAllOrders,
    deleteOrder,
    updateOrderStatus
} = require('../controllers/ordersController');
const { authenticateToken } = require('../middleware/auth');

//USER or ADMIN
router.get('/', authenticateToken, getUserOrders);
router.get('/:orderId', authenticateToken, getOrderById);

//ADMIN ONLY
router.delete('/:orderId', authenticateToken, authorizeRole('admin'), deleteOrder);
router.put('/:orderId', authenticateToken, authorizeRole('admin'), updateOrderStatus);

module.exports = router;
