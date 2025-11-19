// backend/test-server.js
const request = require('supertest');
const app = require('./app'); // your main app file
const mongoose = require('mongoose');

describe('Backend API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('Health check endpoint', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
  });

  test('Get crops endpoint', async () => {
    const response = await request(app).get('/api/crops');
    expect(response.statusCode).toBe(200);
  });
});