import { describe, it, expect, beforeEach } from '@jest/globals';

// 测试环境专用密钥，必须在 import app 之前设置
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-auth-service-tests-only';
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'test-refresh-secret-for-auth-service-tests-only';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'tingwu_dev_password';

import request from 'supertest';
import app from './index';
import { AppDataSource } from './index';

describe('Authentication Service', () => {
  beforeEach(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.initialize();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user with all required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          password: 'password123',
          email: 'test@example.com',
          name: 'Test User',
          grade: 9,
          school: 'Test School',
          targetExamDate: '2025-06-15',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('userId');
      expect(response.body.userId).toBe('testuser');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'testuser',
          // Missing password, email, name, grade
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 409 if username already exists', async () => {
      // Register first user
      await request(app).post('/api/v1/auth/register').send({
        username: 'duplicateuser',
        password: 'password123',
        email: 'duplicate1@example.com',
        name: 'Duplicate User',
        grade: 9,
      });

      // Try to register with same username
      const response = await request(app).post('/api/v1/auth/register').send({
        username: 'duplicateuser',
        password: 'password456',
        email: 'duplicate2@example.com',
        name: 'Duplicate User 2',
        grade: 9,
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Username already exists');
    });

    it('should return 409 if email already exists', async () => {
      // Register first user
      await request(app).post('/api/v1/auth/register').send({
        username: 'user1',
        password: 'password123',
        email: 'same@example.com',
        name: 'User 1',
        grade: 9,
      });

      // Try to register with same email
      const response = await request(app).post('/api/v1/auth/register').send({
        username: 'user2',
        password: 'password456',
        email: 'same@example.com',
        name: 'User 2',
        grade: 9,
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Email already exists');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Register a user before each test
      await request(app).post('/api/v1/auth/register').send({
        username: 'loginuser',
        password: 'password123',
        email: 'login@example.com',
        name: 'Login User',
        grade: 9,
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        username: 'loginuser',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.userId).toBe('loginuser');
    });

    it('should return 401 with invalid password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        username: 'loginuser',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 with non-existent user', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        username: 'nonexistent',
        password: 'password123',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      // First login to get a refresh token
      const loginResponse = await request(app).post('/api/v1/auth/login').send({
        username: 'loginuser',
        password: 'password123',
      });

      const response = await request(app).post('/api/v1/auth/logout').send({
        refreshToken: loginResponse.body.refreshToken,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    it('should refresh token with valid refresh token', async () => {
      // First login to get tokens
      const loginResponse = await request(app).post('/api/v1/auth/login').send({
        username: 'loginuser',
        password: 'password123',
      });

      const response = await request(app).post('/api/v1/auth/refresh-token').send({
        refreshToken: loginResponse.body.refreshToken,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return 403 with invalid refresh token', async () => {
      const response = await request(app).post('/api/v1/auth/refresh-token').send({
        refreshToken: 'invalid-token',
      });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Invalid refresh token');
    });
  });

  describe('POST /api/v1/auth/request-password-reset', () => {
    it('should request password reset for existing email', async () => {
      // Register a user first
      await request(app).post('/api/v1/auth/register').send({
        username: 'resetuser',
        password: 'password123',
        email: 'reset@example.com',
        name: 'Reset User',
        grade: 9,
      });

      const response = await request(app).post('/api/v1/auth/request-password-reset').send({
        email: 'reset@example.com',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should not reveal if email exists', async () => {
      const response = await request(app).post('/api/v1/auth/request-password-reset').send({
        email: 'nonexistent@example.com',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/v1/auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      const response = await request(app).post('/api/v1/auth/reset-password').send({
        token: 'valid-reset-token',
        newPassword: 'newpassword123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Password reset successfully');
    });
  });
});