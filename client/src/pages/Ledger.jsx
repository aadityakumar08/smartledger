import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LedgerTable from '../components/LedgerTable';
import { getCustomers } from '../services/customerService';
import { getTransactions } from '../services/transactionService';
import { formatCurrency } from '../utils/formatters';

const Ledger = () => {
    const [searchParams] = useSearchParams();
    const preselectedCustomer = searchParams.get('customer');

    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(preselectedCustomer || '');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [txnLoading, setTxnLoading] = useState(false);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await getCustomers();
                setCustomers(data);
            } catch (err) {
                console.error('Failed to load customers');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (selectedCustomer) {
            fetchTransactions(selectedCustomer);
        } else {
            setTransactions([]);
        }
    }, [selectedCustomer]);

    const fetchTransactions = async (customerId) => {
        setTxnLoading(true);
        try {
            const data = await getTransactions(customerId);
            setTransactions(data);
        } catch (err) {
            console.error('Failed to load transactions');
        } finally {
            setTxnLoading(false);
        }
    };

    const selected = customers.find(c => c.id == selectedCustomer);

    return (
        <div className="animate-in">
            <div className="page-header">
                <h1>Ledger</h1>
                <p>View transaction history for any customer</p>
            </div>

            <div className="form-group" style={{ maxWidth: 400 }}>
                <label className="form-label">Select Customer</label>
                <select
                    id="ledger-customer-select"
                    className="form-input form-select"
                    value={selectedCustomer}
                    onChange={e => setSelectedCustomer(e.target.value)}
                >
                    <option value="">-- Choose a customer --</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name} — {formatCurrency(c.balance)}
                        </option>
                    ))}
                </select>
            </div>

            {selected && (
                <div className="card-glass" style={{ marginBottom: 'var(--space-xl)', marginTop: 'var(--space-lg)' }}>
                    <div className="flex-between">
                        <div>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{selected.name}</h2>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                📞 {selected.phone}
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="balance-label">Outstanding</div>
                            <div className={`balance-amount ${parseFloat(selected.balance) > 0 ? 'positive' : 'zero'}`}>
                                {formatCurrency(selected.balance)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {txnLoading ? (
                <div className="loading-container"><div className="spinner"></div></div>
            ) : selectedCustomer ? (
                <LedgerTable transactions={transactions} />
            ) : (
                <div className="empty-state" style={{ marginTop: 'var(--space-xl)' }}>
                    <div className="icon">📒</div>
                    <h3>Select a customer</h3>
                    <p>Choose a customer from the dropdown to view their ledger.</p>
                </div>
            )}
        </div>
    );
};

export default Ledger;
