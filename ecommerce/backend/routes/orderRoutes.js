const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateStatus } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createOrder);
router.get('/my', verifyToken, getUserOrders);
router.get('/all', verifyAdmin, getAllOrders);
router.put('/:id/status', verifyAdmin, updateStatus);

module.exports = router;