import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3005;
// JWT Secret — must be set via environment variable; no insecure fallback allowed
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('[scheduling-service] JWT_SECRET environment variable is required. Refusing to start without it.');
}

app.use(express.json());

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

type QuestionType = 'reading_aloud' | 'situational_qa' | 'information_retelling' | 'role_play';

interface ScheduleItem {
  sessionId: string;
  questionType: QuestionType;
  focusArea: string;
  difficulty: 'easy' | 'medium' | 'hard';
  plannedMinutes: number;
}

interface UserSchedule {
  scheduleId: string;
  userId: string;
  generatedAt: string;
  examDate: string | null;
  intensity: 'low' | 'medium' | 'high';
  items: ScheduleItem[];
  completedSessionIds: string[];
}

const schedulesByUser: Record<string, UserSchedule> = {};
const schedulesById: Record<string, UserSchedule> = {};

const randomId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const pickQuestionType = (index: number): QuestionType[] => {
  const weighted: QuestionType[] = ['reading_aloud', 'situational_qa', 'information_retelling', 'role_play'];
  const rotate = index % weighted.length;
  return [...weighted.slice(rotate), ...weighted.slice(0, rotate)];
};

const buildItems = (weakAreas: string[], intensity: 'low' | 'medium' | 'high'): ScheduleItem[] => {
  const sessionCount = intensity === 'high' ? 8 : intensity === 'medium' ? 6 : 4;
  const focusAreas = weakAreas.length > 0 ? weakAreas : ['pronunciation', 'fluency', 'comprehension'];
  return Array.from({ length: sessionCount }, (_, index) => {
    const types = pickQuestionType(index);
    return {
      sessionId: randomId('session'),
      questionType: types[0],
      focusArea: focusAreas[index % focusAreas.length],
      difficulty: index < 2 ? 'easy' : index < 5 ? 'medium' : 'hard',
      plannedMinutes: intensity === 'high' ? 35 : intensity === 'medium' ? 25 : 15,
    };
  });
};

app.get('/health', (_req, res) => {
  return res.json({ status: 'ok', service: 'scheduling-service' });
});

app.post('/api/v1/schedules/generate', authenticateToken, (req, res) => {
  const { userId, weakAreas = [], examDate = null } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const intensity: 'low' | 'medium' | 'high' = examDate ? 'high' : weakAreas.length >= 3 ? 'medium' : 'low';
  const schedule: UserSchedule = {
    scheduleId: randomId('schedule'),
    userId,
    generatedAt: new Date().toISOString(),
    examDate,
    intensity,
    items: buildItems(weakAreas, intensity),
    completedSessionIds: [],
  };

  schedulesByUser[userId] = schedule;
  schedulesById[schedule.scheduleId] = schedule;
  return res.status(201).json(schedule);
});

app.get('/api/v1/schedules/:userId', authenticateToken, (req, res) => {
  const schedule = schedulesByUser[req.params.userId];
  if (!schedule) {
    return res.status(404).json({ error: 'Schedule not found' });
  }
  return res.json(schedule);
});

app.put('/api/v1/schedules/:scheduleId/progress', authenticateToken, (req, res) => {
  const schedule = schedulesById[req.params.scheduleId];
  if (!schedule) {
    return res.status(404).json({ error: 'Schedule not found' });
  }

  const { completedSessionIds = [], performanceDelta = 0 } = req.body || {};
  const merged = new Set([...schedule.completedSessionIds, ...completedSessionIds]);
  schedule.completedSessionIds = Array.from(merged);
  if (performanceDelta > 0) {
    schedule.items = schedule.items.map((item, index) => ({
      ...item,
      difficulty: index < 2 ? item.difficulty : 'hard',
    }));
  }
  if (performanceDelta < 0) {
    schedule.items = schedule.items.map((item, index) => ({
      ...item,
      difficulty: index < 2 ? 'easy' : 'medium',
    }));
  }

  return res.json(schedule);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Scheduling service listening on port ${PORT}`);
  });
}

export default app;
