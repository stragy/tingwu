import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { DataSource } from 'typeorm';
import { User, UserProfile, AuthToken } from '@tingwu/shared-types';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.PORT || 3002;

// Database connection — passwords provided via env only; dev defaults for non-secret fields only
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'tingwu',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'tingwu_db',
  entities: [User, UserProfile, AuthToken],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

// JWT Secret — must be set via environment variable; no insecure fallback allowed
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    '[user-service] JWT_SECRET environment variable is required. Refusing to start without it.'
  );
}

// Middleware to verify JWT token
const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Helper function to find user by username
const findUserByUsername = async (username: string) => {
  return await AppDataSource.getRepository(User).findOne({
    where: { username },
    relations: ['profile'],
  });
};

// Get user profile
app.get('/api/v1/users/:userId/profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await findUserByUsername(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      userId: user.username,
      name: user.name,
      grade: user.grade,
      school: user.school,
      targetExamDate: user.targetExamDate,
      baselineLevel: user.baselineLevel,
      currentLevel: user.currentLevel,
      learningPath: user.learningPath,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/v1/users/:userId/profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, grade, school, targetExamDate } = req.body;

    const user = await findUserByUsername(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (grade) user.grade = grade;
    if (school !== undefined) user.school = school;
    if (targetExamDate) user.targetExamDate = new Date(targetExamDate);

    await AppDataSource.getRepository(User).save(user);

    res.json({
      message: 'Profile updated successfully',
      profile: {
        name: user.name,
        grade: user.grade,
        school: user.school,
        targetExamDate: user.targetExamDate,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize baseline assessment
app.post('/api/v1/users/:userId/baseline-assessment', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await findUserByUsername(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize baseline level with default scores
    const baselineLevel = {
      overall: 50,
      pronunciation: 50,
      fluency: 50,
      intonation: 50,
      comprehension: 50,
    };

    user.baselineLevel = baselineLevel;
    user.currentLevel = { ...baselineLevel };

    await AppDataSource.getRepository(User).save(user);

    res.json({
      message: 'Baseline assessment initialized',
      baselineLevel,
    });
  } catch (error) {
    console.error('Initialize baseline error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get learning path
app.get('/api/v1/users/:userId/learning-path', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await findUserByUsername(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.learningPath) {
      return res.status(404).json({ error: 'Learning path not found' });
    }

    res.json(user.learningPath);
  } catch (error) {
    console.error('Get learning path error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user progress
app.get('/api/v1/users/:userId/progress', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await findUserByUsername(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      userId: user.username,
      currentLevel: user.currentLevel,
      baselineLevel: user.baselineLevel,
      learningPath: user.learningPath,
      progress: user.currentLevel?.overall
        ? ((user.currentLevel.overall / 100) * 100).toFixed(1)
        : 0,
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize database and start server
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`User service listening on port ${PORT}`);
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
