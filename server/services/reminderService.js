/**
 * Reminder Service - Message templates and link generators
 */

const generateReminderMessage = (amount, shopName) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(amount);

    return `Your balance of ${formattedAmount} is Due.\n\nPlease pay at the earliest.\n\n— ${shopName || 'SmartLedger'}`;
};

const generateWhatsAppLink = (phone, message) => {
    // Remove non-numeric characters and ensure country code
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone; // Default India country code
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

const generateSmsLink = (phone, message) => {
    return `sms:${phone}?body=${encodeURIComponent(message)}`;
};

const generateCallLink = (phone) => {
    return `tel:${phone}`;
};

module.exports = {
    generateReminderMessage,
    generateWhatsAppLink,
    generateSmsLink,
    generateCallLink
};
