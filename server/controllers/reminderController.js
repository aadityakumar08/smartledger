const pool = require('../config/db');
const { generateReminderMessage, generateWhatsAppLink, generateSmsLink } = require('../services/reminderService');

exports.sendReminder = async (req, res, next) => {
    try {
        const { customer_id, channel } = req.body;
        const user_id = req.user.id;

        // Get customer info
        const customerResult = await pool.query(
            'SELECT c.*, u.shop_name FROM customers c JOIN users u ON c.user_id = u.id WHERE c.id = $1 AND c.user_id = $2',
            [customer_id, user_id]
        );

        if (customerResult.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found.' });
        }

        const customer = customerResult.rows[0];
        const message = generateReminderMessage(customer.balance, customer.shop_name);

        // Log the reminder
        const logResult = await pool.query(
            'INSERT INTO reminder_logs (customer_id, message, channel, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [customer_id, message, channel, 'sent']
        );

        // Generate action links
        const response = {
            reminder: logResult.rows[0],
            message,
            links: {}
        };

        if (channel === 'whatsapp') {
            response.links.whatsapp = generateWhatsAppLink(customer.phone, message);
        } else if (channel === 'sms') {
            response.links.sms = generateSmsLink(customer.phone, message);
        }

        res.status(201).json(response);
    } catch (err) {
        next(err);
    }
};

exports.getReminderHistory = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { customer_id } = req.query;

        let query = `
      SELECT rl.*, c.name as customer_name, c.phone as customer_phone
      FROM reminder_logs rl
      JOIN customers c ON rl.customer_id = c.id
      WHERE c.user_id = $1
    `;
        const params = [user_id];

        if (customer_id) {
            query += ' AND rl.customer_id = $2';
            params.push(customer_id);
        }

        query += ' ORDER BY rl.sent_at DESC LIMIT 100';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};
