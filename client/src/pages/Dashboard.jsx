import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, TrendingDown, UsersRound, IndianRupee, AlertTriangle, ArrowRight, Users } from 'lucide-react';
import CustomerCard from '../components/CustomerCard';
import { DashboardSkeleton } from '../components/Skeleton';
import { showToast } from '../components/Toast';
import { getCustomers, createCustomer, getSummary } from '../services/customerService';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [summary, setSummary] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const [custData, sumData] = await Promise.all([
                getCustomers(),
                getSummary()
            ]);
            setCustomers(custData);
            setSummary(sumData);
        } catch (err) {
            showToast('Failed to load data. Make sure the backend is running.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        if (!newName || !newPhone) return;
        setSubmitting(true);
        try {
            await createCustomer(newName, newPhone);
            showToast(`Customer "${newName}" added successfully!`, 'success');
            setNewName('');
            setNewPhone('');
            setShowAdd(false);
            fetchData();
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to add customer', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="animate-in">
            <div className="page-header flex-between">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your credit ledger</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                    <UserPlus size={16} />
                    Add Customer
                </button>
            </div>

            {/* Stats */}
            {summary && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-icon danger">
                            <TrendingDown size={20} />
                        </div>
                        <div className="stat-label">Total Outstanding</div>
                        <div className="stat-value" style={{ color: 'var(--color-danger)' }}>
                            {formatCurrency(summary.total_outstanding)}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon primary">
                            <UsersRound size={20} />
                        </div>
                        <div className="stat-label">Total Customers</div>
                        <div className="stat-value">{summary.total_customers}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon success">
                            <IndianRupee size={20} />
                        </div>
                        <div className="stat-label">Total Collected</div>
                        <div className="stat-value" style={{ color: 'var(--color-success)' }}>
                            {formatCurrency(summary.total_collected)}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon warning">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="stat-label">Defaulters</div>
                        <div className="stat-value" style={{ color: 'var(--color-warning)' }}>
                            {summary.defaulters}
                        </div>
                    </div>
                </div>
            )}

            {/* Customer List */}
            <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Recent Customers</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/customers')}>
                    View All
                    <ArrowRight size={14} />
                </button>
            </div>

            {customers.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <Users size={28} />
                    </div>
                    <h3>No customers yet</h3>
                    <p>Add your first customer to start tracking credit.</p>
                    <button className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }} onClick={() => setShowAdd(true)}>
                        <UserPlus size={16} />
                        Add Customer
                    </button>
                </div>
            ) : (
                <div className="customer-grid">
                    {customers.slice(0, 6).map(c => (
                        <CustomerCard key={c.id} customer={c} />
                    ))}
                </div>
            )}

            {/* Add Customer Modal */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal animate-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2><UserPlus size={18} /> Add Customer</h2>
                            <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
                        </div>

                        <form onSubmit={handleAddCustomer}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="customer-name">Customer Name</label>
                                <input
                                    id="customer-name"
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Amit Sharma"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="customer-phone">Phone Number</label>
                                <input
                                    id="customer-phone"
                                    type="tel"
                                    className="form-input"
                                    placeholder="e.g. 9876543210"
                                    value={newPhone}
                                    onChange={e => setNewPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex-gap" style={{ justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                                <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Adding...' : 'Add Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
