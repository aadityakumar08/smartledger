import api from './api';

export const getCustomers = async (search = '') => {
    const { data } = await api.get('/customers', { params: { search } });
    return data;
};

export const getCustomerById = async (id) => {
    const { data } = await api.get(`/customers/${id}`);
    return data;
};

export const createCustomer = async (name, phone) => {
    const { data } = await api.post('/customers', { name, phone });
    return data;
};

export const deleteCustomer = async (id) => {
    const { data } = await api.delete(`/customers/${id}`);
    return data;
};

export const getSummary = async () => {
    const { data } = await api.get('/customers/summary');
    return data;
};
