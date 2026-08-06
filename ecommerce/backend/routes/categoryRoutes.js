const express = require('express');
const router = express.Router();
const { getAll, create, remove } = require('../controllers/categoryController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', getAll);
router.post('/', verifyAdmin, create);
router.delete('/:id', verifyAdmin, remove);

module.exports = router;