import React, { useState, useEffect } from 'react';
import CustomerCard from '../components/CustomerCard';
import { getCustomers, createCustomer } from '../services/customerService';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers(search);
            setCustomers(data);
        } catch (err) {
            setError('Failed to load customers.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [search]);

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        if (!newName || !newPhone) return;
        try {
            await createCustomer(newName, newPhone);
            setNewName('');
            setNewPhone('');
            setShowAdd(false);
            fetchCustomers();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add customer');
        }
    };

    return (
        <div className="animate-in">
            <div className="page-header flex-between">
                <div>
                    <h1>Customers</h1>
                    <p>{customers.length} total customers</p>
                </div>
                <button className="btn btn-primary btn-lg" onClick={() => setShowAdd(true)}>
                    ➕ Add Customer
                </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Search Bar */}
            <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input
                    id="customer-search"
                    type="text"
                    placeholder="Search customers by name or phone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="loading-container"><div className="spinner"></div></div>
            ) : customers.length === 0 ? (
                <div className="empty-state">
                    <div className="icon">👥</div>
                    <h3>{search ? 'No customers found' : 'No customers yet'}</h3>
                    <p>{search ? 'Try a different search term.' : 'Add your first customer to get started.'}</p>
                </div>
            ) : (
                <div className="customer-grid">
                    {customers.map(c => (
                        <CustomerCard key={c.id} customer={c} />
                    ))}
                </div>
            )}

            {/* Add Customer Modal */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal animate-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>➕ Add Customer</h2>
                            <button className="modal-close" onClick={() => setShowAdd(false)}>✕</button>
                        </div>

                        <form onSubmit={handleAddCustomer}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="new-customer-name">Customer Name</label>
                                <input
                                    id="new-customer-name"
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter name"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="new-customer-phone">Phone Number</label>
                                <input
                                    id="new-customer-phone"
                                    type="tel"
                                    className="form-input"
                                    placeholder="9876543210"
                                    value={newPhone}
                                    onChange={e => setNewPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex-gap" style={{ justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                                <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-lg">Add Customer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
