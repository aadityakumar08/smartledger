import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, getInitials, formatDate } from '../utils/formatters';

const CustomerCard = ({ customer }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/customers/${customer.id}`);
    };

    return (
        <div className="customer-card" onClick={handleClick} id={`customer-card-${customer.id}`}>
            <div className="customer-card-header">
                <div className="customer-avatar">
                    {getInitials(customer.name)}
                </div>
                <div className="customer-info">
                    <h3>{customer.name}</h3>
                    <p>📞 {customer.phone}</p>
                </div>
            </div>
            <div className="customer-balance">
                <div>
                    <div className="balance-label">Outstanding</div>
                    <div className={`balance-amount ${parseFloat(customer.balance) > 0 ? 'positive' : 'zero'}`}>
                        {formatCurrency(customer.balance)}
                    </div>
                </div>
                {customer.last_transaction && (
                    <div style={{ textAlign: 'right' }}>
                        <div className="balance-label">Last Txn</div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            {formatDate(customer.last_transaction?.created_at || customer.created_at)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerCard;
