const request = require('supertest');
const app = require('../src/app'); // Ajuste o caminho conforme necessário

describe('API Tests', () => {
    let token;

    beforeAll(async () => {
        // Simula a autenticação e obtém um token
        const response = await request(app)
            .post('/api/auth/login') // Ajuste a rota conforme necessário
            .send({ username: process.env.TEST_USERNAME, password: process.env.TEST_PASSWORD });
        
        token = response.body.token;
    });

    test('GET /api/data - should return data', async () => {
        const response = await request(app)
            .get('/api/data') // Ajuste a rota conforme necessário
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data'); // Ajuste conforme a estrutura esperada
    });

    test('POST /api/data - should add new data', async () => {
        const newData = { name: 'Test Data' }; // Ajuste conforme necessário

        const response = await request(app)
            .post('/api/data') // Ajuste a rota conforme necessário
            .set('Authorization', `Bearer ${token}`)
            .send(newData);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id'); // Ajuste conforme a estrutura esperada
    });

    test('GET /api/data/:id - should return specific data', async () => {
        const response = await request(app)
            .get('/api/data/1') // Ajuste a rota e o ID conforme necessário
            .set('Authorization', `Bearer ${token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name'); // Ajuste conforme a estrutura esperada
    });

    test('Unauthorized access - should return 401', async () => {
        const response = await request(app)
            .get('/api/data') // Ajuste a rota conforme necessário
            .set('Authorization', 'Bearer invalidtoken');
        
        expect(response.status).toBe(401);
    });
});