import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerProfile from './pages/CustomerProfile';
import Ledger from './pages/Ledger';
import Reports from './pages/Reports';
import { isAuthenticated } from './services/authService';

const AppLayout = ({ children }) => (
    <div className="app-layout">
        <Navbar />
        <main className="main-content">{children}</main>
    </div>
);

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated() ? <Navigate to="/" replace /> : <Login />
                } />

                <Route path="/" element={
                    <ProtectedRoute>
                        <AppLayout><Dashboard /></AppLayout>
                    </ProtectedRoute>
                } />

                <Route path="/customers" element={
                    <ProtectedRoute>
                        <AppLayout><Customers /></AppLayout>
                    </ProtectedRoute>
                } />

                <Route path="/customers/:id" element={
                    <ProtectedRoute>
                        <AppLayout><CustomerProfile /></AppLayout>
                    </ProtectedRoute>
                } />

                <Route path="/ledger" element={
                    <ProtectedRoute>
                        <AppLayout><Ledger /></AppLayout>
                    </ProtectedRoute>
                } />

                <Route path="/reports" element={
                    <ProtectedRoute>
                        <AppLayout><Reports /></AppLayout>
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toast />
        </Router>
    );
};

export default App;
