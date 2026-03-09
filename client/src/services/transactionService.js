import api from './api';

export const getTransactions = async (customerId) => {
    const { data } = await api.get(`/transactions/${customerId}`);
    return data;
};

export const createTransaction = async (customer_id, amount, type, note = '') => {
    const { data } = await api.post('/transactions', { customer_id, amount: parseFloat(amount), type, note });
    return data;
};
