const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove } = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', verifyAdmin, create);
router.put('/:id', verifyAdmin, update);
router.delete('/:id', verifyAdmin, remove);

module.exports = router;