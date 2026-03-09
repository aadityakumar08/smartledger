import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../services/authService';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getUser();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const links = [
        { to: '/', label: '📊 Dashboard' },
        { to: '/customers', label: '👥 Customers' },
        { to: '/ledger', label: '📒 Ledger' },
        { to: '/reports', label: '📈 Reports' }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    📗 <span>SmartLedger</span>
                </Link>

                <div className="navbar-links">
                    {links.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex-gap">
                    {user && (
                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            {user.shop_name || user.name}
                        </span>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
