const db = require('../config/db');

const createOrder = async (req, res) => {
  const { items, address, total } = req.body;
  const user_id = req.user.id;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total, address) VALUES (?, ?, ?)',
      [user_id, total, address]
    );
    const order_id = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.id, item.quantity, item.price]
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.id]);
    }

    await conn.commit();
    res.status(201).json({ message: 'Order placed successfully', order_id });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Server error', error: err.message });
  } finally {
    conn.release();
  }
};

const getUserOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, 
       GROUP_CONCAT(p.name SEPARATOR ', ') as products
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = ?
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, u.name as user_name, u.email,
       GROUP_CONCAT(p.name SEPARATOR ', ') as products
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrders, updateStatus };