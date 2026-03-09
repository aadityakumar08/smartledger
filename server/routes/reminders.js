const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const reminderController = require('../controllers/reminderController');

const router = express.Router();

router.use(auth);

router.post(
    '/send',
    [
        body('customer_id').isInt({ gt: 0 }).withMessage('Valid customer ID is required'),
        body('channel').isIn(['whatsapp', 'sms', 'manual']).withMessage('Channel must be whatsapp, sms, or manual')
    ],
    validate,
    reminderController.sendReminder
);

router.get('/history', reminderController.getReminderHistory);

module.exports = router;
