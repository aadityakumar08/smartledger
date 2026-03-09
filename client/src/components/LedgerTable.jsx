import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Tag, BookOpen } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const LedgerTable = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">
                    <BookOpen size={28} />
                </div>
                <h3>No transactions yet</h3>
                <p>Record your first credit or payment to see it here.</p>
            </div>
        );
    }

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

    const displayTxns = withBalance.reverse();

    const typeConfig = {
        credit: { icon: ArrowUpRight, color: 'var(--color-danger)', badge: 'badge-credit', prefix: '+' },
        payment: { icon: ArrowDownLeft, color: 'var(--color-success)', badge: 'badge-payment', prefix: '-' },
        discount: { icon: Tag, color: 'var(--color-warning)', badge: 'badge-discount', prefix: '-' },
    };

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
                    {displayTxns.map((txn, idx) => {
                        const config = typeConfig[txn.type] || typeConfig.credit;
                        const Icon = config.icon;
                        return (
                            <tr key={txn.id} className="animate-in" style={{ animationDelay: `${idx * 30}ms` }}>
                                <td style={{ color: 'var(--color-text-secondary)' }}>{formatDateTime(txn.created_at)}</td>
                                <td>
                                    <span className={`badge ${config.badge}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <Icon size={12} /> {txn.type}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--color-text-secondary)' }}>{txn.note || '—'}</td>
                                <td style={{
                                    textAlign: 'right',
                                    fontWeight: 600,
                                    color: config.color
                                }}>
                                    {config.prefix}{formatCurrency(txn.amount)}
                                </td>
                                <td style={{
                                    textAlign: 'right',
                                    fontWeight: 700,
                                    color: txn.running_balance > 0 ? 'var(--color-danger-light)' : 'var(--color-success-light)'
                                }}>
                                    {formatCurrency(Math.abs(txn.running_balance))}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default LedgerTable;
