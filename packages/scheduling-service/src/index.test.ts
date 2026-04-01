import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// 测试环境专用密钥，确保服务能正常启动
const JWT_SECRET = 'test-jwt-secret-for-scheduling-service-tests-only';
process.env.JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET;

import app from './index';
const authToken = jwt.sign(
  { username: 'test-user', email: 'test@example.com', sub: '1' },
  JWT_SECRET,
  { expiresIn: '1h' }
);
const authHeader = `Bearer ${authToken}`;

describe('Scheduling Service', () => {
  it('should generate schedule', async () => {
    const response = await request(app)
      .post('/api/v1/schedules/generate')
      .set('Authorization', authHeader)
      .send({
        userId: 'user-1',
        weakAreas: ['pronunciation', 'fluency'],
        examDate: '2026-06-01',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('scheduleId');
    expect(response.body).toHaveProperty('userId', 'user-1');
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  it('should get generated schedule by user', async () => {
    await request(app)
      .post('/api/v1/schedules/generate')
      .set('Authorization', authHeader)
      .send({
        userId: 'user-2',
        weakAreas: ['intonation'],
      });

    const response = await request(app)
      .get('/api/v1/schedules/user-2')
      .set('Authorization', authHeader);
    expect(response.status).toBe(200);
    expect(response.body.userId).toBe('user-2');
  });

  it('should update schedule progress', async () => {
    const created = await request(app)
      .post('/api/v1/schedules/generate')
      .set('Authorization', authHeader)
      .send({
        userId: 'user-3',
        weakAreas: ['comprehension'],
      });

    const scheduleId = created.body.scheduleId;
    const sessionId = created.body.items[0].sessionId;
    const response = await request(app)
      .put(`/api/v1/schedules/${scheduleId}/progress`)
      .set('Authorization', authHeader)
      .send({
        completedSessionIds: [sessionId],
        performanceDelta: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body.completedSessionIds).toContain(sessionId);
  });
});
