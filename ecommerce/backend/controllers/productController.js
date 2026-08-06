const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = `SELECT p.*, c.name as category_name 
                 FROM products p 
                 LEFT JOIN categories c ON p.category_id = c.id 
                 WHERE 1=1`;
    const params = [];

    if (search) {
      query += ' AND p.name LIKE ?';
      params.push(`%${search}%`);
    }
    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(products[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const create = async (req, res) => {
  const { name, description, price, stock, image, category_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, stock, image, category_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock, image, category_id]
    );
    res.status(201).json({ message: 'Product created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const update = async (req, res) => {
  const { name, description, price, stock, image, category_id } = req.body;
  try {
    await db.query(
      'UPDATE products SET name=?, description=?, price=?, stock=?, image=?, category_id=? WHERE id=?',
      [name, description, price, stock, image, category_id, req.params.id]
    );
    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };