import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LedgerTable from '../components/LedgerTable';
import TransactionForm from '../components/TransactionForm';
import ReminderModal from '../components/ReminderModal';
import PaymentModal from '../components/PaymentModal';
import { getCustomerById, deleteCustomer } from '../services/customerService';
import { getTransactions, createTransaction } from '../services/transactionService';
import { formatCurrency, formatPhone, getInitials, formatDate } from '../utils/formatters';
import { generateWhatsAppLink, generateSmsLink, generateReminderMessage } from '../services/reminderService';
import { getUser } from '../services/authService';

const CustomerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTxnForm, setShowTxnForm] = useState(false);
    const [showReminder, setShowReminder] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [custData, txnData] = await Promise.all([
                getCustomerById(id),
                getTransactions(id)
            ]);
            setCustomer(custData);
            setTransactions(txnData);
        } catch (err) {
            setError('Failed to load customer data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleTransaction = async ({ amount, type, note }) => {
        try {
            await createTransaction(parseInt(id), amount, type, note);
            setShowTxnForm(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to record transaction');
        }
    };

    const handlePayment = async ({ amount, type, note }) => {
        try {
            await createTransaction(parseInt(id), amount, type, note);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to record payment');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${customer.name}? This will remove all their transactions.`)) return;
        try {
            await deleteCustomer(id);
            navigate('/customers');
        } catch (err) {
            setError('Failed to delete customer.');
        }
    };

    const user = getUser();
    const shopName = user?.shop_name || 'SmartLedger';

    if (loading) {
        return <div className="loading-container"><div className="spinner"></div></div>;
    }

    if (!customer) {
        return <div className="empty-state"><h3>Customer not found</h3></div>;
    }

    const message = generateReminderMessage(customer.balance, shopName);

    const actions = [
        { icon: '🗑️', label: 'Delete', onClick: handleDelete, color: 'var(--color-danger)' },
        { icon: '📤', label: 'Give Credit', onClick: () => setShowTxnForm(true) },
        { icon: '💰', label: 'Collect Payment', onClick: () => setShowPayment(true), color: 'var(--color-success)' },
        { icon: '💬', label: 'WhatsApp', href: generateWhatsAppLink(customer.phone, message), color: '#25D366' },
        { icon: '📱', label: 'SMS', href: generateSmsLink(customer.phone, message) },
        { icon: '📞', label: 'Call', href: `tel:${customer.phone}` },
        { icon: '🔔', label: 'Reminder', onClick: () => setShowReminder(true) },
        { icon: '📊', label: 'Report', onClick: () => navigate(`/ledger?customer=${id}`) },
    ];

    return (
        <div className="animate-in">
            {/* Back Button */}
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--space-md)' }}>
                ← Back
            </button>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Profile Header */}
            <div className="card-glass" style={{ marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                    <div className="customer-avatar" style={{ width: 72, height: 72, fontSize: 'var(--font-size-2xl)' }}>
                        {getInitials(customer.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 4 }}>
                            {customer.name}
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            📞 {formatPhone(customer.phone)} · Customer since {formatDate(customer.created_at)}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="balance-label">Outstanding Balance</div>
                        <div className={`balance-amount ${parseFloat(customer.balance) > 0 ? 'positive' : 'zero'}`} style={{ fontSize: 'var(--font-size-3xl)' }}>
                            {formatCurrency(customer.balance)}
                        </div>
                    </div>
                </div>

                {/* Action Panel */}
                <div className="action-panel">
                    {actions.map((action, i) => (
                        action.href ? (
                            <a key={i} className="action-btn" href={action.href} target="_blank" rel="noopener noreferrer"
                                style={action.color ? { '--hover-color': action.color } : {}}>
                                <span className="icon">{action.icon}</span>
                                {action.label}
                            </a>
                        ) : (
                            <button key={i} className="action-btn" onClick={action.onClick}
                                style={action.color ? { '--hover-color': action.color } : {}}>
                                <span className="icon">{action.icon}</span>
                                {action.label}
                            </button>
                        )
                    ))}
                </div>
            </div>

            {/* Transaction History */}
            <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
                <h2 style={{ fontSize: 'var(--font-size-xl)' }}>Transaction History</h2>
                <button className="btn btn-primary" onClick={() => setShowTxnForm(true)}>
                    ➕ New Transaction
                </button>
            </div>

            <LedgerTable transactions={transactions} />

            {/* Modals */}
            {showTxnForm && (
                <TransactionForm
                    customerName={customer.name}
                    onSubmit={handleTransaction}
                    onCancel={() => setShowTxnForm(false)}
                />
            )}
            {showReminder && (
                <ReminderModal
                    customer={customer}
                    onClose={() => setShowReminder(false)}
                />
            )}
            {showPayment && (
                <PaymentModal
                    customer={customer}
                    onSubmit={handlePayment}
                    onClose={() => setShowPayment(false)}
                />
            )}
        </div>
    );
};

export default CustomerProfile;
