import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// 测试环境专用密钥，确保服务能正常启动
const JWT_SECRET = 'test-jwt-secret-for-analytics-service-tests-only';
process.env.JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET;

import app from './index';
const authToken = jwt.sign(
  { username: 'test-user', email: 'test@example.com', sub: '1' },
  JWT_SECRET,
  { expiresIn: '1h' }
);
const authHeader = `Bearer ${authToken}`;

const createEvent = (userId: string, score: number) =>
  request(app)
    .post('/api/v1/analytics/events')
    .set('Authorization', authHeader)
    .send({
      userId,
      score,
      questionType: 'information_retelling',
      dimensionScores: {
        pronunciation: score - 5,
        fluency: score - 3,
        intonation: score - 4,
        comprehension: score - 2,
      },
    });

describe('Analytics Service', () => {
  it('should record analytics event', async () => {
    const response = await createEvent('user-a', 75);
    expect(response.status).toBe(201);
    expect(response.body.userId).toBe('user-a');
  });

  it('should return progress summary', async () => {
    await createEvent('user-b', 70);
    await createEvent('user-b', 80);

    const response = await request(app)
      .get('/api/v1/analytics/user-b/progress-summary')
      .set('Authorization', authHeader);
    expect(response.status).toBe(200);
    expect(response.body.totalSessions).toBeGreaterThanOrEqual(2);
    expect(response.body.averageScore).toBeGreaterThan(0);
  });

  it('should return performance trend', async () => {
    await createEvent('user-c', 65);
    await createEvent('user-c', 68);

    const response = await request(app)
      .get('/api/v1/analytics/user-c/performance-trend?dimension=fluency')
      .set('Authorization', authHeader);
    expect(response.status).toBe(200);
    expect(response.body.dimension).toBe('fluency');
    expect(response.body.points.length).toBeGreaterThanOrEqual(2);
  });

  it('should return analytics report', async () => {
    await createEvent('user-d', 55);
    await createEvent('user-d', 72);
    await createEvent('user-d', 78);

    const response = await request(app)
      .get('/api/v1/analytics/user-d/report')
      .set('Authorization', authHeader);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('overallAverage');
    expect(response.body).toHaveProperty('weakestDimension');
    expect(response.body.dimensionAverages).toHaveProperty('pronunciation');
  });
});
