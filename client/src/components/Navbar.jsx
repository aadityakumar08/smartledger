import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, BarChart3, LogOut, Store, Menu, X, BookOpenCheck } from 'lucide-react';
import { logout, getUser } from '../services/authService';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getUser();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const links = [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/customers', label: 'Customers', icon: Users },
        { to: '/ledger', label: 'Ledger', icon: BookOpen },
        { to: '/reports', label: 'Reports', icon: BarChart3 }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">
                        <BookOpenCheck size={18} />
                    </div>
                    SmartLedger
                </Link>

                <div className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
                    {links.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <link.icon size={16} />
                            {link.label}
                        </Link>
                    ))}

                    {/* Mobile-only footer */}
                    {mobileOpen && (
                        <div className="navbar-mobile-footer">
                            {user && (
                                <span className="navbar-user-info">
                                    <Store size={14} />
                                    {user.shop_name || user.name}
                                </span>
                            )}
                            <button className="btn btn-ghost btn-sm" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                                <LogOut size={14} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                <div className="navbar-right">
                    {user && (
                        <span className="navbar-user-info">
                            <Store size={14} />
                            {user.shop_name || user.name}
                        </span>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>

                <button
                    className="hamburger"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
