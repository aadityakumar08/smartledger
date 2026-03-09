import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { generateWhatsAppLink, generateSmsLink, generateReminderMessage } from '../services/reminderService';
import { sendReminder } from '../services/reminderService';
import { getUser } from '../services/authService';

const ReminderModal = ({ customer, onClose }) => {
    const [channel, setChannel] = useState('whatsapp');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const user = getUser();
    const shopName = user?.shop_name || 'SmartLedger';
    const message = generateReminderMessage(customer.balance, shopName);

    const handleSend = async () => {
        setSending(true);
        try {
            await sendReminder(customer.id, channel);
            setSent(true);

            // Open the link
            let link = '';
            if (channel === 'whatsapp') {
                link = generateWhatsAppLink(customer.phone, message);
            } else if (channel === 'sms') {
                link = generateSmsLink(customer.phone, message);
            }

            if (link) {
                window.open(link, '_blank');
            }
        } catch (err) {
            console.error('Failed to send reminder:', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal animate-in" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>💬 Send Reminder</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div style={{ marginBottom: 'var(--space-lg)' }}>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xs)' }}>
                        To: <strong style={{ color: 'var(--color-text-primary)' }}>{customer.name}</strong>
                    </p>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        Outstanding: <strong style={{ color: 'var(--color-danger)' }}>{formatCurrency(customer.balance)}</strong>
                    </p>
                </div>

                <div className="form-group">
                    <label className="form-label">Channel</label>
                    <div className="flex-gap" style={{ gap: 'var(--space-sm)' }}>
                        <button
                            className={`btn ${channel === 'whatsapp' ? 'btn-whatsapp' : 'btn-ghost'}`}
                            onClick={() => setChannel('whatsapp')}
                            style={{ flex: 1 }}
                        >
                            💬 WhatsApp
                        </button>
                        <button
                            className={`btn ${channel === 'sms' ? 'btn-sms' : 'btn-ghost'}`}
                            onClick={() => setChannel('sms')}
                            style={{ flex: 1 }}
                        >
                            📱 SMS
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Preview</label>
                    <div style={{
                        background: 'var(--color-bg-input)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-md)',
                        whiteSpace: 'pre-wrap',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        border: '1px solid var(--color-border)'
                    }}>
                        {message}
                    </div>
                </div>

                {sent && (
                    <div className="alert alert-success">
                        ✅ Reminder logged successfully!
                    </div>
                )}

                <div className="flex-gap" style={{ justifyContent: 'flex-end', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                    <button className="btn btn-ghost" onClick={onClose}>Close</button>
                    <button
                        className={`btn ${channel === 'whatsapp' ? 'btn-whatsapp' : 'btn-sms'} btn-lg`}
                        onClick={handleSend}
                        disabled={sending}
                    >
                        {sending ? 'Sending...' : `Send via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReminderModal;
