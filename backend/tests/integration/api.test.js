//  Mock must come BEFORE imports
import { jest } from '@jest/globals';

await jest.unstable_mockModule('../../src/intents/embedder.js', () => ({
  embed: async () => []
}));

import request from 'supertest';
import app from '../../src/app.js';

describe('API Integration Suite', () => {
  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/orders/:id returns mock order data', async () => {
    const res = await request(app).get('/api/orders/12345');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('Processing');
  });

  it('GET /events returns empty event list initially', async () => {
    const res = await request(app).get('/events');
    expect(res.status).toBe(200);
    expect(res.body.events).toEqual([]);
    expect(res.body.done).toBe(false);
  });

  it('POST /webhook/support-update stores an event', async () => {
    const webhookPayload = {
      event: 'assigned',
      ticketId: 'T123',
      agent: 'Alice'
    };

    const res = await request(app).post('/webhook/support-update').send(webhookPayload);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');

    const eventsRes = await request(app).get('/events');
    expect(eventsRes.body.events.length).toBe(1);
    expect(eventsRes.body.done).toBe(true);
  });

  it('POST /agent returns a valid response', async () => {
    const res = await request(app).post('/agent').send({ message: 'hello' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('text');
    expect(res.body).toHaveProperty('intent');
  });

  it('Unknown route returns 404', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });
});
