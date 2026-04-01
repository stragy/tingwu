import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3006;
// JWT Secret — must be set via environment variable; no insecure fallback allowed
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('[analytics-service] JWT_SECRET environment variable is required. Refusing to start without it.');
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

type Dimension = 'pronunciation' | 'fluency' | 'intonation' | 'comprehension';

interface AnalyticsEvent {
  userId: string;
  score: number;
  dimensionScores: Record<Dimension, number>;
  questionType: string;
  timestamp: string;
}

const eventsByUser: Record<string, AnalyticsEvent[]> = {};

const average = (values: number[]) => (values.length ? values.reduce((acc, value) => acc + value, 0) / values.length : 0);

app.get('/health', (_req, res) => {
  return res.json({ status: 'ok', service: 'analytics-service' });
});

app.post('/api/v1/analytics/events', authenticateToken, (req, res) => {
  const { userId, score, dimensionScores, questionType } = req.body || {};
  if (!userId || typeof score !== 'number' || !dimensionScores || !questionType) {
    return res.status(400).json({ error: 'Invalid event payload' });
  }

  const event: AnalyticsEvent = {
    userId,
    score,
    dimensionScores,
    questionType,
    timestamp: new Date().toISOString(),
  };
  eventsByUser[userId] = [...(eventsByUser[userId] || []), event];
  return res.status(201).json(event);
});

app.get('/api/v1/analytics/:userId/progress-summary', authenticateToken, (req, res) => {
  const events = eventsByUser[req.params.userId] || [];
  if (!events.length) {
    return res.status(404).json({ error: 'Analytics not found' });
  }

  const latest = events[events.length - 1];
  const first = events[0];
  return res.json({
    userId: req.params.userId,
    totalSessions: events.length,
    averageScore: Number(average(events.map((event) => event.score)).toFixed(2)),
    scoreImprovement: Number((latest.score - first.score).toFixed(2)),
    lastUpdatedAt: latest.timestamp,
  });
});

app.get('/api/v1/analytics/:userId/performance-trend', authenticateToken, (req, res) => {
  const dimension = (req.query.dimension as Dimension) || 'pronunciation';
  const events = eventsByUser[req.params.userId] || [];
  if (!events.length) {
    return res.status(404).json({ error: 'Analytics not found' });
  }

  return res.json({
    userId: req.params.userId,
    dimension,
    points: events.map((event) => ({
      timestamp: event.timestamp,
      score: event.dimensionScores[dimension],
    })),
  });
});

app.get('/api/v1/analytics/:userId/report', authenticateToken, (req, res) => {
  const events = eventsByUser[req.params.userId] || [];
  if (!events.length) {
    return res.status(404).json({ error: 'Analytics not found' });
  }

  const dimensions: Dimension[] = ['pronunciation', 'fluency', 'intonation', 'comprehension'];
  const dimensionAverages = dimensions.reduce<Record<Dimension, number>>((acc, dimension) => {
    acc[dimension] = Number(
      average(events.map((event) => event.dimensionScores[dimension])).toFixed(2)
    );
    return acc;
  }, { pronunciation: 0, fluency: 0, intonation: 0, comprehension: 0 });

  const weakArea = dimensions.reduce((prev, current) =>
    dimensionAverages[current] < dimensionAverages[prev] ? current : prev
  );

  return res.json({
    userId: req.params.userId,
    totalSessions: events.length,
    overallAverage: Number(average(events.map((event) => event.score)).toFixed(2)),
    dimensionAverages,
    weakestDimension: weakArea,
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Analytics service listening on port ${PORT}`);
  });
}

export default app;
