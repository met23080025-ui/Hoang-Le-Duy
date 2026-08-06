const db = require('../config/db');

const getAll = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const create = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Category created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAll, create, remove };