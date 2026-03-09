const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const customerController = require('../controllers/customerController');

const router = express.Router();

router.use(auth);

router.post(
    '/',
    [
        body('name').trim().notEmpty().withMessage('Customer name is required'),
        body('phone').trim().notEmpty().withMessage('Phone number is required')
            .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Invalid phone number format')
    ],
    validate,
    customerController.createCustomer
);

router.get('/', customerController.getCustomers);
router.get('/summary', customerController.getSummary);
router.get('/:id', customerController.getCustomerById);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
