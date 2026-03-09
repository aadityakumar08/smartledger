import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingDown, TrendingUp, Percent, AlertTriangle, PartyPopper } from 'lucide-react';
import { getCustomers, getSummary } from '../services/customerService';
import { formatCurrency } from '../utils/formatters';
import { ReportsSkeleton } from '../components/Skeleton';
import { showToast } from '../components/Toast';

const Reports = () => {
    const [summary, setSummary] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sumData, custData] = await Promise.all([
                    getSummary(),
                    getCustomers()
                ]);
                setSummary(sumData);
                setCustomers(custData);
            } catch (err) {
                showToast('Failed to load reports', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <ReportsSkeleton />;
    }

    const defaulters = customers
        .filter(c => parseFloat(c.balance) > 0)
        .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance));

    const totalCredit = summary?.total_credit || 0;
    const totalCollected = summary?.total_collected || 0;
    const collectionRate = totalCredit > 0 ? ((totalCollected / totalCredit) * 100).toFixed(1) : 0;

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>Reports</h1>
                <p>Financial summary and insights</p>
            </div>

            {summary && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-icon primary">
                            <IndianRupee size={20} />
                        </div>
                        <div className="stat-label">Total Credit Given</div>
                        <div className="stat-value">{formatCurrency(totalCredit)}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon success">
                            <TrendingUp size={20} />
                        </div>
                        <div className="stat-label">Total Collected</div>
                        <div className="stat-value" style={{ color: 'var(--color-success)' }}>
                            {formatCurrency(totalCollected)}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon danger">
                            <TrendingDown size={20} />
                        </div>
                        <div className="stat-label">Outstanding</div>
                        <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
                            {formatCurrency(summary.total_outstanding)}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon warning">
                            <Percent size={20} />
                        </div>
                        <div className="stat-label">Collection Rate</div>
                        <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
                            {collectionRate}%
                        </div>
                    </div>
                </div>
            )}

            {/* Defaulters Table */}
            <div style={{ marginTop: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
                    Defaulters ({defaulters.length})
                </h2>

                {defaulters.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <PartyPopper size={28} />
                        </div>
                        <h3>No defaulters!</h3>
                        <p>All customers have cleared their balances.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Phone</th>
                                    <th style={{ textAlign: 'right' }}>Outstanding Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {defaulters.map((c, idx) => (
                                    <tr key={c.id} className="animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
                                        <td style={{ color: 'var(--color-text-muted)' }}>{idx + 1}</td>
                                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                                        <td style={{ color: 'var(--color-text-secondary)' }}>{c.phone}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-danger)' }}>
                                            {formatCurrency(c.balance)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* All Customers Summary */}
            <div style={{ marginTop: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
                    All Customers Summary
                </h2>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th style={{ textAlign: 'right' }}>Balance</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(c => (
                                <tr key={c.id}>
                                    <td style={{ fontWeight: 500 }}>{c.name}</td>
                                    <td style={{ color: 'var(--color-text-secondary)' }}>{c.phone}</td>
                                    <td style={{
                                        textAlign: 'right',
                                        fontWeight: 700,
                                        color: parseFloat(c.balance) > 0 ? 'var(--color-danger)' : 'var(--color-success)'
                                    }}>
                                        {formatCurrency(c.balance)}
                                    </td>
                                    <td>
                                        <span className={`badge ${parseFloat(c.balance) > 0 ? 'badge-credit' : 'badge-payment'}`}>
                                            {parseFloat(c.balance) > 0 ? 'Due' : 'Cleared'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
