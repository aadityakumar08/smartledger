import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CreditCard, Wallet, MessageCircle, Smartphone, PhoneCall, Bell, BarChart3 } from 'lucide-react';
import LedgerTable from '../components/LedgerTable';
import TransactionForm from '../components/TransactionForm';
import ReminderModal from '../components/ReminderModal';
import PaymentModal from '../components/PaymentModal';
import { SkeletonProfile, SkeletonRow } from '../components/Skeleton';
import { showToast } from '../components/Toast';
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

    const fetchData = async () => {
        try {
            const [custData, txnData] = await Promise.all([
                getCustomerById(id),
                getTransactions(id)
            ]);
            setCustomer(custData);
            setTransactions(txnData);
        } catch (err) {
            showToast('Failed to load customer data.', 'error');
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
            showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} of ${formatCurrency(amount)} recorded!`, 'success');
            fetchData();
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to record transaction', 'error');
        }
    };

    const handlePayment = async ({ amount, type, note }) => {
        try {
            await createTransaction(parseInt(id), amount, type, note);
            showToast(`Payment of ${formatCurrency(amount)} collected!`, 'success');
            fetchData();
        } catch (err) {
            showToast(err.response?.data?.error || 'Failed to record payment', 'error');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${customer.name}? This will remove all their transactions.`)) return;
        try {
            await deleteCustomer(id);
            showToast(`${customer.name} deleted successfully.`, 'info');
            navigate('/customers');
        } catch (err) {
            showToast('Failed to delete customer.', 'error');
        }
    };

    const user = getUser();
    const shopName = user?.shop_name || 'SmartLedger';

    if (loading) {
        return (
            <div className="animate-in">
                <button className="btn btn-ghost btn-sm" disabled style={{ marginBottom: 'var(--space-md)' }}>
                    <ArrowLeft size={14} /> Back
                </button>
                <SkeletonProfile />
                <div className="table-container">
                    <table className="table">
                        <thead><tr><th>Date</th><th>Type</th><th>Note</th><th>Amount</th><th>Balance</th></tr></thead>
                        <tbody>
                            <SkeletonRow columns={5} />
                            <SkeletonRow columns={5} />
                            <SkeletonRow columns={5} />
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (!customer) {
        return <div className="empty-state"><h3>Customer not found</h3></div>;
    }

    const message = generateReminderMessage(customer.balance, shopName);

    const actions = [
        { icon: Trash2, label: 'Delete', onClick: handleDelete, color: 'var(--color-danger)' },
        { icon: CreditCard, label: 'Give Credit', onClick: () => setShowTxnForm(true) },
        { icon: Wallet, label: 'Collect Payment', onClick: () => setShowPayment(true), color: 'var(--color-success)' },
        { icon: MessageCircle, label: 'WhatsApp', href: generateWhatsAppLink(customer.phone, message), color: '#22C55E' },
        { icon: Smartphone, label: 'SMS', href: generateSmsLink(customer.phone, message) },
        { icon: PhoneCall, label: 'Call', href: `tel:${customer.phone}` },
        { icon: Bell, label: 'Reminder', onClick: () => setShowReminder(true) },
        { icon: BarChart3, label: 'Report', onClick: () => navigate(`/ledger?customer=${id}`) },
    ];

    return (
        <div className="animate-in">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--space-md)' }}>
                <ArrowLeft size={14} /> Back
            </button>

            {/* Profile Header */}
            <div className="card-glass" style={{ marginBottom: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
                    <div className="customer-avatar" style={{ width: 64, height: 64, fontSize: 'var(--font-size-2xl)' }}>
                        {getInitials(customer.name)}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 4 }}>
                            {customer.name}
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <PhoneCall size={13} /> {formatPhone(customer.phone)} · Since {formatDate(customer.created_at)}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="balance-label">Outstanding Balance</div>
                        <div className={`balance-amount ${parseFloat(customer.balance) > 0 ? 'positive' : 'zero'}`} style={{ fontSize: 'var(--font-size-3xl)' }}>
                            {formatCurrency(customer.balance)}
                        </div>
                    </div>
                </div>

                <div className="action-panel">
                    {actions.map((action, i) => {
                        const Icon = action.icon;
                        return action.href ? (
                            <a key={i} className="action-btn" href={action.href} target="_blank" rel="noopener noreferrer">
                                <Icon size={18} />
                                {action.label}
                            </a>
                        ) : (
                            <button key={i} className="action-btn" onClick={action.onClick}>
                                <Icon size={18} />
                                {action.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Transaction History */}
            <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>Transaction History</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setShowTxnForm(true)}>
                    <CreditCard size={14} /> New Transaction
                </button>
            </div>

            <LedgerTable transactions={transactions} />

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
