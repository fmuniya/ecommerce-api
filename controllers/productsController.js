const pool = require('../db');

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, price, stock, image_url FROM products'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllProducts };
