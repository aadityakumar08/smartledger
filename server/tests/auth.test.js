const request = require('supertest');
const app = require('../server');

// Mock the database pool
jest.mock('../config/db', () => {
    const mockPool = {
        query: jest.fn(),
        connect: jest.fn(),
        on: jest.fn()
    };
    return mockPool;
});

const pool = require('../config/db');

describe('Auth Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should return 400 if name is missing', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ email: 'test@test.com', password: '123456' });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation failed');
        });

        it('should return 400 if email is invalid', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test', email: 'invalid', password: '123456' });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation failed');
        });

        it('should return 400 if password is too short', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test', email: 'test@test.com', password: '123' });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Validation failed');
        });

        it('should return 409 if email already exists', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test', email: 'exists@test.com', password: '123456' });

            expect(res.status).toBe(409);
        });

        it('should create user and return token on valid registration', async () => {
            pool.query
                .mockResolvedValueOnce({ rows: [] }) // email check
                .mockResolvedValueOnce({
                    rows: [{ id: 1, name: 'Test', email: 'test@test.com', shop_name: '', created_at: new Date() }]
                }); // insert

            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'Test', email: 'test@test.com', password: '123456' });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 400 if email is missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ password: '123456' });

            expect(res.status).toBe(400);
        });

        it('should return 401 if user not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'notfound@test.com', password: '123456' });

            expect(res.status).toBe(401);
        });
    });
});

describe('Health Check', () => {
    it('should return ok status', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});

describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/api/nonexistent');
        expect(res.status).toBe(404);
    });
});
