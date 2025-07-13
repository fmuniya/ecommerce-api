const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController');


const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public access
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Authorised access
router.post('/', authenticateToken, authorizeRole('admin'), createProduct);
router.put('/:id', authenticateToken, authorizeRole('admin'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteProduct);


module.exports = router;
