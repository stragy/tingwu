import { describe, it, expect, beforeEach } from '@jest/globals';

// 测试环境专用密钥，必须在 import app 之前设置
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-user-service-tests-only';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'tingwu_dev_password';

import request from 'supertest';
import app from './index';
import { AppDataSource } from './index';

describe('User Service', () => {
  beforeEach(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.initialize();
  });

  describe('GET /api/v1/users/:userId/profile', () => {
    it('should get user profile', async () => {
      // First create a user via auth service (simulate)
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.username = 'testuser';
      user.email = 'test@example.com';
      user.passwordHash = 'hashedpassword';
      user.name = 'Test User';
      user.grade = 9;
      user.school = 'Test School';
      user.targetExamDate = new Date('2025-06-15');
      user.baselineLevel = null;
      user.currentLevel = null;
      user.learningPath = null;
      
      await userRepo.save(user);

      const response = await request(app)
        .get('/api/v1/users/testuser/profile')
        .set('Authorization', 'Bearer valid-token'); // Mock token for testing

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId', 'testuser');
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('grade', 9);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/v1/users/nonexistent/profile')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('PUT /api/v1/users/:userId/profile', () => {
    it('should update user profile', async () => {
      // First create a user
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.username = 'updateuser';
      user.email = 'update@example.com';
      user.passwordHash = 'hashedpassword';
      user.name = 'Original Name';
      user.grade = 9;
      user.school = 'Original School';
      user.targetExamDate = new Date('2025-06-15');
      user.baselineLevel = null;
      user.currentLevel = null;
      user.learningPath = null;
      
      await userRepo.save(user);

      const response = await request(app)
        .put('/api/v1/users/updateuser/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({
          name: 'Updated Name',
          grade: 10,
          school: 'Updated School',
          targetExamDate: '2024-06-15'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Profile updated successfully');
      expect(response.body.profile).toHaveProperty('name', 'Updated Name');
      expect(response.body.profile).toHaveProperty('grade', 10);
      expect(response.body.profile).toHaveProperty('school', 'Updated School');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/api/v1/users/nonexistent/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'New Name' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('POST /api/v1/users/:userId/baseline-assessment', () => {
    it('should initialize baseline assessment', async () => {
      // First create a user
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.username = 'baselineuser';
      user.email = 'baseline@example.com';
      user.passwordHash = 'hashedpassword';
      user.name = 'Baseline User';
      user.grade = 9;
      user.school = 'Test School';
      user.targetExamDate = new Date('2025-06-15');
      user.baselineLevel = null;
      user.currentLevel = null;
      user.learningPath = null;
      
      await userRepo.save(user);

      const response = await request(app)
        .post('/api/v1/users/baselineuser/baseline-assessment')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Baseline assessment initialized');
      expect(response.body.baselineLevel).toHaveProperty('overall', 50);
      expect(response.body.baselineLevel).toHaveProperty('pronunciation', 50);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/v1/users/nonexistent/baseline-assessment')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('GET /api/v1/users/:userId/learning-path', () => {
    it('should return 404 when learning path not found', async () => {
      // First create a user
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.username = 'pathuser';
      user.email = 'path@example.com';
      user.passwordHash = 'hashedpassword';
      user.name = 'Path User';
      user.grade = 9;
      user.school = 'Test School';
      user.targetExamDate = new Date('2025-06-15');
      user.baselineLevel = null;
      user.currentLevel = null;
      user.learningPath = null;
      
      await userRepo.save(user);

      const response = await request(app)
        .get('/api/v1/users/pathuser/learning-path')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Learning path not found');
    });
  });

  describe('GET /api/v1/users/:userId/progress', () => {
    it('should get user progress', async () => {
      // First create a user
      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.username = 'progressuser';
      user.email = 'progress@example.com';
      user.passwordHash = 'hashedpassword';
      user.name = 'Progress User';
      user.grade = 9;
      user.school = 'Test School';
      user.targetExamDate = new Date('2025-06-15');
      user.baselineLevel = {
        overall: 50,
        pronunciation: 50,
        fluency: 50,
        intonation: 50,
        comprehension: 50,
      };
      user.currentLevel = {
        overall: 75,
        pronunciation: 80,
        fluency: 70,
        intonation: 75,
        comprehension: 70,
      };
      user.learningPath = null;
      
      await userRepo.save(user);

      const response = await request(app)
        .get('/api/v1/users/progressuser/progress')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('userId', 'progressuser');
      expect(response.body).toHaveProperty('progress', '75.0');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/v1/users/nonexistent/progress')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });
});

// Import User entity for test setup
import { User } from '@tingwu/shared-types';