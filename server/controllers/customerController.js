const pool = require('../config/db');

exports.createCustomer = async (req, res, next) => {
    try {
        const { name, phone } = req.body;
        const user_id = req.user.id;

        const result = await pool.query(
            'INSERT INTO customers (user_id, name, phone, balance) VALUES ($1, $2, $3, 0) RETURNING *',
            [user_id, name, phone]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

exports.getCustomers = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { search } = req.query;

        let query = 'SELECT * FROM customers WHERE user_id = $1';
        const params = [user_id];

        if (search) {
            query += ' AND (LOWER(name) LIKE $2 OR phone LIKE $2)';
            params.push(`%${search.toLowerCase()}%`);
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

exports.getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const customerResult = await pool.query(
            'SELECT * FROM customers WHERE id = $1 AND user_id = $2',
            [id, user_id]
        );

        if (customerResult.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found.' });
        }

        const customer = customerResult.rows[0];

        // Get last transaction
        const lastTxn = await pool.query(
            'SELECT * FROM transactions WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 1',
            [id]
        );

        customer.last_transaction = lastTxn.rows[0] || null;

        res.json(customer);
    } catch (err) {
        next(err);
    }
};

exports.deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const result = await pool.query(
            'DELETE FROM customers WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found.' });
        }

        res.json({ message: 'Customer deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.getSummary = async (req, res, next) => {
    try {
        const user_id = req.user.id;

        const totalResult = await pool.query(
            'SELECT COALESCE(SUM(balance), 0) as total_outstanding, COUNT(*) as total_customers FROM customers WHERE user_id = $1',
            [user_id]
        );

        const defaultersResult = await pool.query(
            'SELECT COUNT(*) as defaulters FROM customers WHERE user_id = $1 AND balance > 0',
            [user_id]
        );

        const creditResult = await pool.query(
            `SELECT COALESCE(SUM(t.amount), 0) as total_credit
       FROM transactions t
       JOIN customers c ON t.customer_id = c.id
       WHERE c.user_id = $1 AND t.type = 'credit'`,
            [user_id]
        );

        const paymentResult = await pool.query(
            `SELECT COALESCE(SUM(t.amount), 0) as total_collected
       FROM transactions t
       JOIN customers c ON t.customer_id = c.id
       WHERE c.user_id = $1 AND t.type = 'payment'`,
            [user_id]
        );

        res.json({
            total_outstanding: parseFloat(totalResult.rows[0].total_outstanding),
            total_customers: parseInt(totalResult.rows[0].total_customers),
            defaulters: parseInt(defaultersResult.rows[0].defaulters),
            total_credit: parseFloat(creditResult.rows[0].total_credit),
            total_collected: parseFloat(paymentResult.rows[0].total_collected)
        });
    } catch (err) {
        next(err);
    }
};
