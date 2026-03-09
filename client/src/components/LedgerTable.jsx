import React from 'react';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const LedgerTable = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="empty-state">
                <div className="icon">📒</div>
                <h3>No transactions yet</h3>
                <p>Record your first credit or payment to see it here.</p>
            </div>
        );
    }

    // Calculate running balance (from oldest to newest)
    const sorted = [...transactions].reverse();
    let runningBalance = 0;
    const withBalance = sorted.map(txn => {
        if (txn.type === 'credit') {
            runningBalance += parseFloat(txn.amount);
        } else {
            runningBalance -= parseFloat(txn.amount);
        }
        return { ...txn, running_balance: runningBalance };
    });

    // Display in newest first order
    const displayTxns = withBalance.reverse();

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Note</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                        <th style={{ textAlign: 'right' }}>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {displayTxns.map((txn, idx) => (
                        <tr key={txn.id} className="animate-in" style={{ animationDelay: `${idx * 30}ms` }}>
                            <td>{formatDateTime(txn.created_at)}</td>
                            <td>
                                <span className={`badge badge-${txn.type}`}>
                                    {txn.type === 'credit' ? '📤' : txn.type === 'payment' ? '📥' : '🏷️'} {txn.type}
                                </span>
                            </td>
                            <td style={{ color: 'var(--color-text-secondary)' }}>{txn.note || '—'}</td>
                            <td style={{
                                textAlign: 'right',
                                fontWeight: 600,
                                color: txn.type === 'credit' ? 'var(--color-danger)' : 'var(--color-success)'
                            }}>
                                {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                            </td>
                            <td style={{
                                textAlign: 'right',
                                fontWeight: 700,
                                color: txn.running_balance > 0 ? 'var(--color-danger-light)' : 'var(--color-success-light)'
                            }}>
                                {formatCurrency(Math.abs(txn.running_balance))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LedgerTable;
