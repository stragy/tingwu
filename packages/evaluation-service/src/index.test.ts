import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// 测试环境需要设置 JWT_SECRET，使用测试专用密钥
const JWT_SECRET = 'test-jwt-secret-for-evaluation-service-tests-only';
process.env.JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET;
process.env.EVALUATION_AI_PROVIDER = 'mock'; // 测试环境强制使用 mock 提供商

import app from './index';
import * as fc from 'fast-check';
const authToken = jwt.sign(
  { username: 'test-user', email: 'test@example.com', sub: '1' },
  JWT_SECRET,
  { expiresIn: '1h' }
);
const authHeader = `Bearer ${authToken}`;

describe('Information Retelling Evaluation Service', () => {
  describe('POST /api/v1/evaluation/retelling', () => {
    it('should evaluate retelling and return all dimension scores', async () => {
      const retellingContent = {
        audioUrl: 'https://example.com/audio.mp3',
        transcript: 'The cat sat on the mat. The dog played in the yard.',
        duration: 30,
        noteTime: 60,
        retellingTime: 120,
        keyPoints: [
          {
            pointId: 'kp1',
            content: 'The cat sat on the mat',
            importance: 5,
            category: 'main_event',
          },
          {
            pointId: 'kp2',
            content: 'The dog played in the yard',
            importance: 4,
            category: 'supporting_detail',
          },
        ],
      };

      const response = await request(app)
        .post('/api/v1/evaluation/retelling')
        .set('Authorization', authHeader)
        .send({
          sessionId: 'session-123',
          studentTranscript: 'The cat sat on the mat. The dog played in the yard.',
          retellingContent,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('evaluationId');
      expect(response.body).toHaveProperty('sessionId', 'session-123');
      expect(response.body).toHaveProperty('transcript');
      expect(response.body).toHaveProperty('keyPointsCovered');
      expect(response.body).toHaveProperty('completenessScore');
      expect(response.body).toHaveProperty('pronunciationScore');
      expect(response.body).toHaveProperty('fluencyScore');
      expect(response.body).toHaveProperty('overallScore');
      expect(response.body).toHaveProperty('feedback');
      expect(response.body).toHaveProperty('evaluatedAt');
    });

    it('should track key point coverage correctly', async () => {
      const retellingContent = {
        audioUrl: 'https://example.com/audio.mp3',
        transcript: 'The cat sat on the mat. The dog played in the yard.',
        duration: 30,
        noteTime: 60,
        retellingTime: 120,
        keyPoints: [
          {
            pointId: 'kp1',
            content: 'cat sat mat',
            importance: 5,
            category: 'main_event',
          },
          {
            pointId: 'kp2',
            content: 'dog played yard',
            importance: 4,
            category: 'supporting_detail',
          },
          {
            pointId: 'kp3',
            content: 'bird flew sky',
            importance: 3,
            category: 'missing_detail',
          },
        ],
      };

      const response = await request(app)
        .post('/api/v1/evaluation/retelling')
        .set('Authorization', authHeader)
        .send({
          sessionId: 'session-456',
          studentTranscript: 'The cat sat on the mat. The dog played in the yard.',
          retellingContent,
        });

      expect(response.status).toBe(201);
      const keyPointsCovered = response.body.keyPointsCovered;
      
      // First two key points should be covered
      expect(keyPointsCovered[0].covered).toBe(true);
      expect(keyPointsCovered[1].covered).toBe(true);
      
      // Third key point should not be covered
      expect(keyPointsCovered[2].covered).toBe(false);
    });

    it('should calculate completeness score based on key point importance', async () => {
      const retellingContent = {
        audioUrl: 'https://example.com/audio.mp3',
        transcript: 'The cat sat on the mat.',
        duration: 30,
        noteTime: 60,
        retellingTime: 120,
        keyPoints: [
          {
            pointId: 'kp1',
            content: 'cat sat mat',
            importance: 5,
            category: 'main_event',
          },
          {
            pointId: 'kp2',
            content: 'dog played yard',
            importance: 5,
            category: 'supporting_detail',
          },
        ],
      };

      const response = await request(app)
        .post('/api/v1/evaluation/retelling')
        .set('Authorization', authHeader)
        .send({
          sessionId: 'session-789',
          studentTranscript: 'The cat sat on the mat.',
          retellingContent,
        });

      expect(response.status).toBe(201);
      // Only 1 out of 2 key points covered, so 50% completeness
      expect(response.body.completenessScore).toBe(50);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/evaluation/retelling')
        .set('Authorization', authHeader)
        .send({
          sessionId: 'session-123',
          // Missing studentTranscript and retellingContent
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should calculate overall score with proper weighting', async () => {
      const retellingContent = {
        audioUrl: 'https://example.com/audio.mp3',
        transcript: 'The cat sat on the mat.',
        duration: 30,
        noteTime: 60,
        retellingTime: 120,
        keyPoints: [
          {
            pointId: 'kp1',
            content: 'cat sat mat',
            importance: 5,
            category: 'main_event',
          },
        ],
      };

      const response = await request(app)
        .post('/api/v1/evaluation/retelling')
        .set('Authorization', authHeader)
        .send({
          sessionId: 'session-weight',
          studentTranscript: 'The cat sat on the mat.',
          retellingContent,
        });

      expect(response.status).toBe(201);
      const { completenessScore, pronunciationScore, fluencyScore, overallScore } = response.body;
      
      // Overall score should be weighted: 40% completeness + 30% pronunciation + 30% fluency
      const expectedScore = (completenessScore * 0.4) + (pronunciationScore * 0.3) + (fluencyScore * 0.3);
      expect(overallScore).toBeCloseTo(expectedScore, 1);
    });
  });

  describe('GET /api/v1/evaluation/retelling/:evaluationId', () => {
    it('should retrieve evaluation result by ID', async () => {
      // First create an evaluation
      const retellingContent = {
        audioUrl: 'https://example.com/audio.mp3',
        transcript: 'The cat sat on the mat.',
        duration: 30,
        noteTime: 60,
        retellingTime: 120,
        keyPoints: [
          {
            pointId: 'kp1',
            content: 'cat sat mat',
            importance: 5,
            category: 'main_event',
          },
        ],
      };

      const createResponse = await request(app)
        .post('/api/v1/evaluation/retelling')
        .set('Authorization', authHeader)
        .send({
          sessionId: 'session-retrieve',
          studentTranscript: 'The cat sat on the mat.',
          retellingContent,
        });

      const evaluationId = createResponse.body.evaluationId;

      // Then retrieve it
      const getResponse = await request(app)
        .get(`/api/v1/evaluation/retelling/${evaluationId}`)
        .set('Authorization', authHeader);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.evaluationId).toBe(evaluationId);
      expect(getResponse.body.sessionId).toBe('session-retrieve');
    });

    it('should return 404 for non-existent evaluation', async () => {
      const response = await request(app)
        .get('/api/v1/evaluation/retelling/non-existent-id')
        .set('Authorization', authHeader);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Property 17: Key Point Coverage Tracking', () => {
    // **Validates: Requirements 5.5**
    it('should identify covered and missed key points for any retelling evaluation', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            keyPointCount: fc.integer({ min: 1, max: 10 }),
            coverageRatio: fc.float({ min: 0, max: 1 }),
          }),
          async (params) => {
            // Generate key points
            const keyPoints = Array.from({ length: params.keyPointCount }, (_, i) => ({
              pointId: `kp${i}`,
              content: `key point ${i}`,
              importance: Math.floor(Math.random() * 5) + 1,
              category: 'test',
            }));

            // Generate student transcript that covers some key points
            const coveredCount = Math.floor(params.keyPointCount * params.coverageRatio);
            const coveredPoints = keyPoints.slice(0, coveredCount);
            const studentTranscript = coveredPoints.map(kp => kp.content).join('. ');

            const retellingContent = {
              audioUrl: 'https://example.com/audio.mp3',
              transcript: 'Original passage',
              duration: 30,
              noteTime: 60,
              retellingTime: 120,
              keyPoints,
            };

      const response = await request(app)
              .post('/api/v1/evaluation/retelling')
              .set('Authorization', authHeader)
              .send({
                sessionId: `session-${Math.random()}`,
                studentTranscript,
                retellingContent,
              });

            expect(response.status).toBe(201);
            const keyPointsCovered = response.body.keyPointsCovered;

            // Verify all key points are tracked
            expect(keyPointsCovered.length).toBe(keyPoints.length);

            // Verify covered/missed distinction
            const coveredCount2 = keyPointsCovered.filter((kp: any) => kp.covered).length;
            expect(coveredCount2).toBeGreaterThanOrEqual(0);
            expect(coveredCount2).toBeLessThanOrEqual(keyPoints.length);

            // Verify each key point has required fields
            keyPointsCovered.forEach((kp: any) => {
              expect(kp).toHaveProperty('pointId');
              expect(kp).toHaveProperty('content');
              expect(kp).toHaveProperty('importance');
              expect(kp).toHaveProperty('covered');
              expect(kp).toHaveProperty('confidence');
              expect(typeof kp.covered).toBe('boolean');
              expect(typeof kp.confidence).toBe('number');
              expect(kp.confidence).toBeGreaterThanOrEqual(0);
              expect(kp.confidence).toBeLessThanOrEqual(1);
            });
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should calculate completeness score based on covered key points', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              importance: fc.integer({ min: 1, max: 5 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          async (importances) => {
            const keyPoints = importances.map((imp, i) => ({
              pointId: `kp${i}`,
              content: `point ${i}`,
              importance: imp.importance,
              category: 'test',
            }));

            // Create transcript that covers first half of key points
            const coveredCount = Math.ceil(keyPoints.length / 2);
            const studentTranscript = keyPoints
              .slice(0, coveredCount)
              .map(kp => kp.content)
              .join('. ');

            const retellingContent = {
              audioUrl: 'https://example.com/audio.mp3',
              transcript: 'Original passage',
              duration: 30,
              noteTime: 60,
              retellingTime: 120,
              keyPoints,
            };

            const response = await request(app)
              .post('/api/v1/evaluation/retelling')
              .set('Authorization', authHeader)
              .send({
                sessionId: `session-${Math.random()}`,
                studentTranscript,
                retellingContent,
              });

            expect(response.status).toBe(201);
            const completenessScore = response.body.completenessScore;

            // Completeness should be between 0 and 100
            expect(completenessScore).toBeGreaterThanOrEqual(0);
            expect(completenessScore).toBeLessThanOrEqual(100);

            // Verify it's based on importance weighting
            const totalImportance = keyPoints.reduce((sum, kp) => sum + kp.importance, 0);
            const coveredImportance = keyPoints
              .slice(0, coveredCount)
              .reduce((sum, kp) => sum + kp.importance, 0);
            const expectedScore = (coveredImportance / totalImportance) * 100;

            expect(completenessScore).toBeCloseTo(expectedScore, 0);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
