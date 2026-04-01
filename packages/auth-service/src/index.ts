import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DataSource } from 'typeorm';
import { User, AuthToken, UserProfile } from '@tingwu/shared-types';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection — passwords provided via env only; dev defaults for non-secret fields only
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'tingwu',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'tingwu_db',
  entities: [User, AuthToken, UserProfile],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});

// JWT Secret — must be set via environment variable; no insecure fallback allowed
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    '[auth-service] JWT_SECRET environment variable is required. Refusing to start without it.'
  );
}
if (!REFRESH_TOKEN_SECRET) {
  throw new Error(
    '[auth-service] REFRESH_TOKEN_SECRET environment variable is required. Refusing to start without it.'
  );
}

// Helper function to find user by username or email
const findUser = async (username?: string, email?: string) => {
  if (username) {
    return await AppDataSource.getRepository(User).findOne({
      where: { username },
    });
  }
  if (email) {
    return await AppDataSource.getRepository(User).findOne({
      where: { email },
    });
  }
  return null;
};

// Helper function to store refresh token
const storeRefreshToken = async (userId: number, refreshToken: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const tokenEntity = new AuthToken();
  tokenEntity.userId = userId;
  tokenEntity.refreshToken = refreshToken;
  tokenEntity.expiresAt = expiresAt;
  tokenEntity.revoked = false;

  await AppDataSource.getRepository(AuthToken).save(tokenEntity);
};

// Helper function to revoke refresh token
const revokeRefreshToken = async (refreshToken: string) => {
  await AppDataSource.getRepository(AuthToken).update({ refreshToken }, { revoked: true });
};

// Helper function to validate refresh token
const validateRefreshToken = async (refreshToken: string) => {
  const tokenRepo = AppDataSource.getRepository(AuthToken);
  const token = await tokenRepo.findOne({
    where: { refreshToken },
    relations: ['user'],
  });

  if (!token || token.revoked) {
    return null;
  }

  if (token.expiresAt < new Date()) {
    return null;
  }

  return token;
};

// --- Android compatibility (SMS auth + simplified response wrapper) ---
// Android client in this repo calls /auth/* (no /api/v1) and expects {code,message,data}.
const smsCodesByPhone: Record<string, { code: string; expiresAt: Date }> = {};
const generateSmsCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const apiResponse = <T>(
  res: express.Response,
  resCode: number,
  message: string,
  data: T | null
) => {
  res.json({ code: resCode, message, data });
};

const getBearerToken = (req: express.Request): string | null => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  return token || null;
};

// Register endpoint
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { username, password, email, name, grade, school, targetExamDate } = req.body;

    // Validate required fields
    if (!username || !password || !email || !name || !grade) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          username: !username ? 'Username is required' : null,
          password: !password ? 'Password is required' : null,
          email: !email ? 'Email is required' : null,
          name: !name ? 'Name is required' : null,
          grade: !grade ? 'Grade is required' : null,
        },
      });
    }

    // Check if user already exists
    const existingUser = await findUser(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const existingEmail = await findUser(undefined, email);
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User();
    user.username = username;
    user.email = email;
    user.passwordHash = passwordHash;
    user.name = name;
    user.grade = grade;
    user.school = school || null;
    user.targetExamDate = targetExamDate ? new Date(targetExamDate) : null;
    user.baselineLevel = null;
    user.currentLevel = null;
    user.learningPath = null;

    await AppDataSource.getRepository(User).save(user);

    // Generate tokens
    const accessToken = jwt.sign(
      { username: user.username, email: user.email, sub: user.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign({ username: user.username, sub: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    await storeRefreshToken(user.id, refreshToken);

    return res.status(201).json({
      accessToken,
      refreshToken,
      userId: user.username,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          username: !username ? 'Username is required' : null,
          password: !password ? 'Password is required' : null,
        },
      });
    }

    const user = await findUser(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { username: user.username, email: user.email, sub: user.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign({ username: user.username, sub: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    await storeRefreshToken(user.id, refreshToken);

    return res.json({
      accessToken,
      refreshToken,
      userId: user.username,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/api/v1/auth/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Refresh token endpoint
app.post('/api/v1/auth/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const tokenRecord = await validateRefreshToken(refreshToken);

    if (!tokenRecord) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      {
        username: tokenRecord.user.username,
        email: tokenRecord.user.email,
        sub: tokenRecord.user.id,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const newRefreshToken = jwt.sign(
      { username: tokenRecord.user.username, sub: tokenRecord.user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Update refresh token mapping
    await revokeRefreshToken(refreshToken);
    await storeRefreshToken(tokenRecord.user.id, newRefreshToken);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: tokenRecord.user.username,
      expiresIn: 3600,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Android: request SMS code (demo mode)
app.post('/auth/request-sms', async (req, res) => {
  try {
    const { phoneNumber } = req.body || {};
    if (!phoneNumber) {
      return res.status(400).json({ code: 400, message: 'phoneNumber is required', data: null });
    }

    const code = generateSmsCode();
    smsCodesByPhone[phoneNumber] = {
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    };

    return apiResponse(res, 200, 'SMS code sent', null);
  } catch (error) {
    console.error('request-sms error:', error);
    return res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// Android: verify SMS code and issue tokens
app.post('/auth/verify-sms', async (req, res) => {
  try {
    const { phoneNumber, code } = req.body || {};
    if (!phoneNumber || !code) {
      return res
        .status(400)
        .json({ code: 400, message: 'phoneNumber and code are required', data: null });
    }

    const stored = smsCodesByPhone[phoneNumber];
    const isValid =
      code === '123456' || // dev-friendly fallback
      (!!stored && stored.expiresAt > new Date() && stored.code === code);

    if (!isValid) {
      return res.status(401).json({ code: 401, message: 'Invalid verification code', data: null });
    }

    // Treat phoneNumber as username for demo compatibility.
    let user = await findUser(phoneNumber);
    if (!user) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(`${phoneNumber}:${code}`, saltRounds);

      user = new User();
      user.username = phoneNumber;
      user.email = `${phoneNumber}@sms.local`;
      user.passwordHash = passwordHash;
      user.name = 'SMS User';
      user.grade = 0;
      user.school = null;
      user.targetExamDate = null;
      user.baselineLevel = null;
      user.currentLevel = null;
      user.learningPath = null;

      await AppDataSource.getRepository(User).save(user);
    }

    const accessToken = jwt.sign(
      { username: user.username, email: user.email, sub: user.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign({ username: user.username, sub: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    await storeRefreshToken(user.id, refreshToken);

    return apiResponse(res, 200, 'Login success', {
      accessToken,
      refreshToken,
      expiresIn: 3600,
    } as any);
  } catch (error) {
    console.error('verify-sms error:', error);
    return res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// Android: refresh token (expects Authorization: Bearer <refreshToken>)
app.get('/auth/refresh', async (req, res) => {
  try {
    const bearer = getBearerToken(req);
    if (!bearer) {
      return res.status(401).json({ code: 401, message: 'Access token required', data: null });
    }

    const tokenRecord = await validateRefreshToken(bearer);
    if (!tokenRecord) {
      return res.status(403).json({ code: 403, message: 'Invalid refresh token', data: null });
    }

    const newAccessToken = jwt.sign(
      {
        username: tokenRecord.user.username,
        email: tokenRecord.user.email,
        sub: tokenRecord.user.id,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const newRefreshToken = jwt.sign(
      { username: tokenRecord.user.username, sub: tokenRecord.user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    await revokeRefreshToken(bearer);
    await storeRefreshToken(tokenRecord.user.id, newRefreshToken);

    return apiResponse(res, 200, 'Token refreshed', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
    } as any);
  } catch (error) {
    console.error('refresh error:', error);
    return res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// Android: logout (expects Authorization: Bearer <refreshToken>)
app.post('/auth/logout', async (req, res) => {
  try {
    const bearer = getBearerToken(req);
    if (bearer) {
      await revokeRefreshToken(bearer);
    }

    return apiResponse(res, 200, 'Logged out successfully', null);
  } catch (error) {
    console.error('logout error:', error);
    return res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// =====================================================================
// Push Notification Device Token Management (Android FCM integration)
// =====================================================================

// In-memory device token registry (replace with DB in production)
const deviceTokens: Record<string, { fcmToken: string; platform: string; registeredAt: Date }> = {};

const getBearerUser = (req: express.Request): string | null => {
  const token = getBearerToken(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as any;
    return decoded.username || null;
  } catch {
    return null;
  }
};

// Register device push token
app.post('/notification/device/register', (req, res) => {
  try {
    const username = getBearerUser(req);
    if (!username) {
      return res.status(401).json({ code: 401, message: 'Access token required', data: null });
    }

    const { fcmToken, platform = 'android' } = req.body || {};
    if (!fcmToken) {
      return res.status(400).json({ code: 400, message: 'fcmToken is required', data: null });
    }

    deviceTokens[username] = { fcmToken, platform, registeredAt: new Date() };
    console.log(`[push] Registered FCM token for user ${username}`);

    return apiResponse(res, 200, 'Device registered successfully', null);
  } catch (error) {
    console.error('register device token error:', error);
    return res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// Unregister device push token
app.delete('/notification/device/unregister', (req, res) => {
  try {
    const username = getBearerUser(req);
    if (!username) {
      return res.status(401).json({ code: 401, message: 'Access token required', data: null });
    }

    delete deviceTokens[username];
    console.log(`[push] Unregistered FCM token for user ${username}`);

    return apiResponse(res, 200, 'Device unregistered successfully', null);
  } catch (error) {
    console.error('unregister device token error:', error);
    return res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// Password reset request endpoint
app.post('/api/v1/auth/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await findUser(undefined, email);

    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // In production, send email with reset link
    // For now, just return success
    return res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Password reset endpoint
app.post('/api/v1/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          token: !token ? 'Reset token is required' : null,
          newPassword: !newPassword ? 'New password is required' : null,
        },
      });
    }

    // In production, verify reset token and update password
    // For now, just return success
    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize database and start server
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Auth service listening on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

startServer();

export { AppDataSource };
export default app;
