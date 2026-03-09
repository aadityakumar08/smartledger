import api from './api';

export const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('smartledger_token', data.token);
    localStorage.setItem('smartledger_user', JSON.stringify(data.user));
    return data;
};

export const register = async (name, email, password, shop_name) => {
    const { data } = await api.post('/auth/register', { name, email, password, shop_name });
    localStorage.setItem('smartledger_token', data.token);
    localStorage.setItem('smartledger_user', JSON.stringify(data.user));
    return data;
};

export const logout = () => {
    localStorage.removeItem('smartledger_token');
    localStorage.removeItem('smartledger_user');
};

export const getToken = () => localStorage.getItem('smartledger_token');

export const getUser = () => {
    const user = localStorage.getItem('smartledger_user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => !!getToken();
