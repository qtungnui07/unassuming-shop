import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from './app.js';

describe('HTTP API boundaries', () => {
  const app = createApp();

  it('reports health without requiring the database', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  it('does not expose admin operations without a session', async () => {
    const response = await request(app).get('/api/admin/orders');
    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/Authentication/);
  });

  it('does not expose customer orders without a session', async () => {
    const response = await request(app).get('/api/account/orders');
    expect(response.status).toBe(401);
    expect(response.body.error).toMatch(/Authentication/);
  });

  it('validates registration before touching the database', async () => {
    const response = await request(app).post('/api/account/register').send({
      name: 'A',
      email: 'not-an-email',
      phone: '1',
      password: 'short',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid request');
  });

  it('validates reset tokens and password strength before querying', async () => {
    const response = await request(app).post('/api/account/reset-password').send({
      token: 'short',
      password: 'short',
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid request');
  });

  it('rejects malformed quote requests before querying products', async () => {
    const response = await request(app).post('/api/orders/quote').send({ items: [] });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid request');
  });
});
