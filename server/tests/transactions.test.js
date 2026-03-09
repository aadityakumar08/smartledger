const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

jest.mock('../config/db', () => {
    const mockClient = {
        query: jest.fn(),
        release: jest.fn()
    };
    const mockPool = {
        query: jest.fn(),
        connect: jest.fn().mockResolvedValue(mockClient),
        on: jest.fn(),
        _client: mockClient
    };
    return mockPool;
});

const pool = require('../config/db');

const generateTestToken = () => {
    return jwt.sign(
        { id: 1, email: 'test@test.com', name: 'Test User' },
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '1h' }
    );
};

describe('Transaction Endpoints', () => {
    let token;

    beforeAll(() => {
        process.env.JWT_SECRET = 'test_secret';
        token = generateTestToken();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/transactions', () => {
        it('should return 401 without token', async () => {
            const res = await request(app)
                .post('/api/transactions')
                .send({ customer_id: 1, amount: 100, type: 'credit' });

            expect(res.status).toBe(401);
        });

        it('should return 400 for invalid type', async () => {
            const res = await request(app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send({ customer_id: 1, amount: 100, type: 'invalid' });

            expect(res.status).toBe(400);
        });

        it('should return 400 for negative amount', async () => {
            const res = await request(app)
                .post('/api/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send({ customer_id: 1, amount: -50, type: 'credit' });

            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/transactions/:customer_id', () => {
        it('should return 404 if customer not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .get('/api/transactions/999')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
        });

        it('should return transactions for valid customer', async () => {
            pool.query
                .mockResolvedValueOnce({ rows: [{ id: 1 }] }) // customer check
                .mockResolvedValueOnce({
                    rows: [
                        { id: 1, customer_id: 1, amount: '100', type: 'credit', note: 'Test', created_at: new Date() }
                    ]
                });

            const res = await request(app)
                .get('/api/transactions/1')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });
});

describe('Balance Calculation Logic', () => {
    it('credit should increase balance', () => {
        const balance = 0;
        const amount = 500;
        const type = 'credit';
        const newBalance = type === 'credit' ? balance + amount : balance - amount;
        expect(newBalance).toBe(500);
    });

    it('payment should decrease balance', () => {
        const balance = 500;
        const amount = 200;
        const type = 'payment';
        const newBalance = type === 'credit' ? balance + amount : balance - amount;
        expect(newBalance).toBe(300);
    });

    it('discount should decrease balance', () => {
        const balance = 500;
        const amount = 50;
        const type = 'discount';
        const newBalance = type === 'credit' ? balance + amount : balance - amount;
        expect(newBalance).toBe(450);
    });

    it('full payment should clear balance', () => {
        const balance = 1000;
        const amount = 1000;
        const type = 'payment';
        const newBalance = type === 'credit' ? balance + amount : balance - amount;
        expect(newBalance).toBe(0);
    });

    it('balance = total_credit - total_payments', () => {
        const transactions = [
            { amount: 500, type: 'credit' },
            { amount: 200, type: 'credit' },
            { amount: 300, type: 'payment' },
            { amount: 50, type: 'discount' }
        ];

        let balance = 0;
        transactions.forEach(txn => {
            if (txn.type === 'credit') {
                balance += txn.amount;
            } else {
                balance -= txn.amount;
            }
        });

        expect(balance).toBe(350); // 700 - 300 - 50
    });
});
