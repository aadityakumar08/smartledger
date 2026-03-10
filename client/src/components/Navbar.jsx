import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { LayoutDashboard, Users, BookOpen, BarChart3, LogOut, Store, Menu, X, BookOpenCheck } from 'lucide-react';
import { logout, getUser } from '../services/authService';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getUser();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate('/login');
    };

    const links = [
        { to: '/', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/customers', label: 'Customers', icon: Users },
        { to: '/ledger', label: 'Ledger', icon: BookOpen },
        { to: '/reports', label: 'Reports', icon: BarChart3 }
    ];

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-brand">
                        <div className="navbar-brand-icon">
                            <BookOpenCheck size={18} />
                        </div>
                        SmartLedger
                    </Link>

                    {/* Desktop nav links */}
                    <div className="navbar-links-desktop">
                        {links.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                            >
                                <link.icon size={16} />
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop user info */}
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

                    {/* Hamburger button */}
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

            {/* Mobile overlay — portaled to document.body so it's OUTSIDE any sticky/flex parents */}
            {mobileOpen && createPortal(
                <div className="mobile-nav-overlay">
                    {links.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <link.icon size={20} />
                            {link.label}
                        </Link>
                    ))}

                    <div className="mobile-nav-divider" />

                    {user && (
                        <div className="mobile-nav-user">
                            <Store size={16} />
                            {user.shop_name || user.name}
                        </div>
                    )}
                    <button className="btn btn-ghost" onClick={handleLogout} style={{ width: '100%' }}>
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>,
                document.body
            )}
        </>
    );
};

export default Navbar;
