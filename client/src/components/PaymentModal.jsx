import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';

const PaymentModal = ({ customer, onSubmit, onClose }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;
        setLoading(true);
        try {
            await onSubmit({ amount: parseFloat(amount), type: 'payment', note });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal animate-in" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>💰 Collect Payment</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
                        From: <strong style={{ color: 'var(--color-text-primary)' }}>{customer.name}</strong>
                    </p>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Outstanding: <strong style={{ color: 'var(--color-danger)' }}>{formatCurrency(customer.balance)}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Payment Amount (₹)</label>
                        <input
                            id="payment-amount"
                            type="number"
                            className="form-input"
                            placeholder="Enter amount received"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            min="0.01"
                            step="0.01"
                            max={customer.balance}
                            required
                            autoFocus
                        />
                        <button
                            type="button"
                            style={{
                                marginTop: 'var(--space-xs)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-primary-light)',
                                fontSize: 'var(--font-size-sm)',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-family)'
                            }}
                            onClick={() => setAmount(customer.balance.toString())}
                        >
                            Pay full amount: {formatCurrency(customer.balance)}
                        </button>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Note (optional)</label>
                        <input
                            id="payment-note"
                            type="text"
                            className="form-input"
                            placeholder="e.g. Cash payment"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                    </div>

                    <div className="flex-gap" style={{ justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button
                            type="submit"
                            className="btn btn-success btn-lg"
                            disabled={loading || !amount}
                        >
                            {loading ? 'Processing...' : '✅ Collect Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
