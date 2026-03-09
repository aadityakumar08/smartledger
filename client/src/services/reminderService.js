import api from './api';

export const sendReminder = async (customer_id, channel) => {
    const { data } = await api.post('/reminders/send', { customer_id, channel });
    return data;
};

export const getReminderHistory = async (customer_id = null) => {
    const params = customer_id ? { customer_id } : {};
    const { data } = await api.get('/reminders/history', { params });
    return data;
};

export const generateWhatsAppLink = (phone, message) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

export const generateSmsLink = (phone, message) => {
    return `sms:${phone}?body=${encodeURIComponent(message)}`;
};

export const generateReminderMessage = (amount, shopName = 'SmartLedger') => {
    const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);
    return `Your balance of ${formatted} is Due.\n\nPlease pay at the earliest.\n\n— ${shopName}`;
};
