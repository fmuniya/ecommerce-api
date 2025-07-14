const pool = require('../db');

// GET /api/orders - Get all orders for the authenticated user
const getUserOrders = async (req, res) => {
  const userId = req.user.userId;

  try {
    const ordersResult = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json(ordersResult.rows);
  } catch (err) {
    console.error('getUserOrders error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/orders/:orderId - Get a specific order and its items
const getOrderById = async (req, res) => {
  const userId = req.user.userId;
  const { orderId } = req.params;

  try {
    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const itemsResult = await pool.query(
      `SELECT oi.quantity, oi.price, p.name, p.description, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (err) {
    console.error('getOrderById error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUserOrders,
  getOrderById
};
