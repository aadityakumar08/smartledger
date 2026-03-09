import React, { useState, useEffect, useCallback } from 'react';

let toastIdCounter = 0;
let addToastGlobal = null;

// Global function to show toasts from anywhere
export const showToast = (message, type = 'success', duration = 3000) => {
    if (addToastGlobal) {
        addToastGlobal({ id: ++toastIdCounter, message, type, duration });
    }
};

const Toast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        setToasts(prev => [...prev, { ...toast, exiting: false }]);
        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === toast.id ? { ...t, exiting: true } : t));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, 300);
        }, toast.duration);
    }, []);

    useEffect(() => {
        addToastGlobal = addToast;
        return () => { addToastGlobal = null; };
    }, [addToast]);

    const dismissToast = (id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 300);
    };

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container" role="status" aria-live="polite">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast toast-${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}
                    onClick={() => dismissToast(toast.id)}
                >
                    <span className="toast-icon">{icons[toast.type]}</span>
                    <span className="toast-message">{toast.message}</span>
                    <button className="toast-dismiss" aria-label="Dismiss">✕</button>
                </div>
            ))}
        </div>
    );
};

export default Toast;
