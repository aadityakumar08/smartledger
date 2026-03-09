import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { formatCurrency, getInitials } from '../utils/formatters';

const CustomerCard = ({ customer }) => {
    const navigate = useNavigate();
    const balance = parseFloat(customer.balance) || 0;

    return (
        <div
            className="customer-card"
            onClick={() => navigate(`/customers/${customer.id}`)}
        >
            <div className="customer-card-header">
                <div className="customer-avatar">
                    {getInitials(customer.name)}
                </div>
                <div className="customer-info">
                    <h3>{customer.name}</h3>
                    <p>
                        <Phone size={11} />
                        {customer.phone}
                    </p>
                </div>
            </div>
            <div className="customer-balance">
                <span className="balance-label">Outstanding</span>
                <span className={`balance-amount ${balance > 0 ? 'positive' : 'zero'}`}>
                    {formatCurrency(balance)}
                </span>
            </div>
        </div>
    );
};

export default CustomerCard;
