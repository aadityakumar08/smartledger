const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

jest.mock('../config/db', () => {
    const mockPool = {
        query: jest.fn(),
        connect: jest.fn(),
        on: jest.fn()
    };
    return mockPool;
});

const pool = require('../config/db');

// Generate a valid JWT for protected routes
const generateTestToken = () => {
    return jwt.sign(
        { id: 1, email: 'test@test.com', name: 'Test User' },
        process.env.JWT_SECRET || 'test_secret',
        { expiresIn: '1h' }
    );
};

describe('Customer Endpoints', () => {
    let token;

    beforeAll(() => {
        process.env.JWT_SECRET = 'test_secret';
        token = generateTestToken();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/customers', () => {
        it('should return 401 without token', async () => {
            const res = await request(app)
                .post('/api/customers')
                .send({ name: 'Customer', phone: '9876543210' });

            expect(res.status).toBe(401);
        });

        it('should return 400 if name is missing', async () => {
            const res = await request(app)
                .post('/api/customers')
                .set('Authorization', `Bearer ${token}`)
                .send({ phone: '9876543210' });

            expect(res.status).toBe(400);
        });

        it('should create a customer with valid data', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [{ id: 1, user_id: 1, name: 'TestCust', phone: '9876543210', balance: '0', created_at: new Date() }]
            });

            const res = await request(app)
                .post('/api/customers')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'TestCust', phone: '9876543210' });

            expect(res.status).toBe(201);
            expect(res.body.name).toBe('TestCust');
        });
    });

    describe('GET /api/customers', () => {
        it('should return customer list', async () => {
            pool.query.mockResolvedValueOnce({
                rows: [
                    { id: 1, name: 'Customer A', phone: '1234567890', balance: '500' },
                    { id: 2, name: 'Customer B', phone: '0987654321', balance: '0' }
                ]
            });

            const res = await request(app)
                .get('/api/customers')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
        });
    });

    describe('DELETE /api/customers/:id', () => {
        it('should return 404 if customer not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .delete('/api/customers/999')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(404);
        });

        it('should delete customer', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

            const res = await request(app)
                .delete('/api/customers/1')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toContain('deleted');
        });
    });
});
