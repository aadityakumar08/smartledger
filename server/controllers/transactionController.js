const pool = require('../config/db');

exports.createTransaction = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const { customer_id, amount, type, note } = req.body;
        const user_id = req.user.id;

        // Verify customer belongs to user
        const customerCheck = await client.query(
            'SELECT id, balance FROM customers WHERE id = $1 AND user_id = $2',
            [customer_id, user_id]
        );

        if (customerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found.' });
        }

        await client.query('BEGIN');

        // Insert transaction
        const txnResult = await client.query(
            'INSERT INTO transactions (customer_id, amount, type, note) VALUES ($1, $2, $3, $4) RETURNING *',
            [customer_id, amount, type, note || '']
        );

        // Update balance: credit increases, payment/discount decreases
        let balanceChange;
        if (type === 'credit') {
            balanceChange = amount;
        } else {
            balanceChange = -amount;
        }

        await client.query(
            'UPDATE customers SET balance = balance + $1 WHERE id = $2',
            [balanceChange, customer_id]
        );

        await client.query('COMMIT');

        // Get updated customer balance
        const updatedCustomer = await client.query(
            'SELECT balance FROM customers WHERE id = $1',
            [customer_id]
        );

        res.status(201).json({
            transaction: txnResult.rows[0],
            new_balance: parseFloat(updatedCustomer.rows[0].balance)
        });
    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};

exports.getTransactions = async (req, res, next) => {
    try {
        const { customer_id } = req.params;
        const user_id = req.user.id;

        // Verify customer belongs to user
        const customerCheck = await pool.query(
            'SELECT id FROM customers WHERE id = $1 AND user_id = $2',
            [customer_id, user_id]
        );

        if (customerCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found.' });
        }

        const result = await pool.query(
            'SELECT * FROM transactions WHERE customer_id = $1 ORDER BY created_at DESC',
            [customer_id]
        );

        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};
