import React, { useState } from 'react';

const TransactionForm = ({ onSubmit, onCancel, customerName }) => {
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('credit');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return;
        setLoading(true);
        try {
            await onSubmit({ amount: parseFloat(amount), type, note });
            setAmount('');
            setNote('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal animate-in" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>New Transaction</h2>
                    <button className="modal-close" onClick={onCancel}>✕</button>
                </div>

                {customerName && (
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                        Customer: <strong style={{ color: 'var(--color-text-primary)' }}>{customerName}</strong>
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <div className="flex-gap" style={{ gap: 'var(--space-sm)' }}>
                            {['credit', 'payment', 'discount'].map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    className={`btn ${type === t ? (t === 'credit' ? 'btn-danger' : t === 'payment' ? 'btn-success' : 'btn-primary') : 'btn-ghost'}`}
                                    onClick={() => setType(t)}
                                    style={{ flex: 1, textTransform: 'capitalize' }}
                                >
                                    {t === 'credit' ? '📤' : t === 'payment' ? '📥' : '🏷️'} {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Amount (₹)</label>
                        <input
                            id="transaction-amount"
                            type="number"
                            className="form-input"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            min="0.01"
                            step="0.01"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Note (optional)</label>
                        <input
                            id="transaction-note"
                            type="text"
                            className="form-input"
                            placeholder="e.g. Monthly supplies"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                    </div>

                    <div className="flex-gap" style={{ justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
                        <button
                            type="submit"
                            className={`btn ${type === 'credit' ? 'btn-danger' : 'btn-success'} btn-lg`}
                            disabled={loading || !amount}
                        >
                            {loading ? 'Processing...' : `Record ${type}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
