const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

router.use(auth);

router.post(
    '/',
    [
        body('customer_id').isInt({ gt: 0 }).withMessage('Valid customer ID is required'),
        body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
        body('type').isIn(['credit', 'payment', 'discount']).withMessage('Type must be credit, payment, or discount'),
        body('note').optional().trim()
    ],
    validate,
    transactionController.createTransaction
);

router.get('/:customer_id', transactionController.getTransactions);

module.exports = router;
