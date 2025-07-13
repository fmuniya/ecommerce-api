const pool = require('../db');

// POST /api/cart
// Create a new cart for the user or return existing active cart
const createOrGetCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Check if user already has a cart
    const existingCart = await pool.query('SELECT * FROM carts WHERE user_id = $1', [userId]);

    if (existingCart.rows.length > 0) {
      return res.status(200).json(existingCart.rows[0]);
    }

    // Create a new cart
    const result = await pool.query(
      'INSERT INTO carts (user_id) VALUES ($1) RETURNING *',
      [userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createOrGetCart error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/cart/:cartId
// Add or update product quantity in the cart
const addOrUpdateCartItem = async (req, res) => {
  const { cartId } = req.params;
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity || quantity < 1) {
    return res.status(400).json({ error: 'product_id and quantity (>=1) are required' });
  }

  try {
    // Check if cart exists and belongs to the user
    const cartResult = await pool.query('SELECT * FROM carts WHERE id = $1', [cartId]);
    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (cartResult.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: Not your cart' });
    }

    // Check if the item already exists in the cart
    const existingItem = await pool.query(
      'SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const updated = await pool.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
        [quantity, existingItem.rows[0].id]
      );
      return res.status(200).json(updated.rows[0]);
    } else {
      // Insert new item
      const inserted = await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [cartId, product_id, quantity]
      );
      return res.status(201).json(inserted.rows[0]);
    }
  } catch (err) {
    console.error('addOrUpdateCartItem error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/cart/:cartId
// Get all items in a cart with product details
const getCartContents = async (req, res) => {
  const { cartId } = req.params;

  try {
    // Check if cart exists and belongs to user
    const cartResult = await pool.query('SELECT * FROM carts WHERE id = $1', [cartId]);
    if (cartResult.rows.length === 0) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (cartResult.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden: Not your cart' });
    }

    // Get cart items with product details
    const itemsResult = await pool.query(`
      SELECT ci.id as cart_item_id, ci.quantity, p.id as product_id, p.name, p.description, p.price, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    res.json({ cart: cartResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    console.error('getCartContents error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createOrGetCart,
  addOrUpdateCartItem,
  getCartContents,
};
