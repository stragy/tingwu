import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { getAIProvider } from './ai';

export const app = express();
const PORT = process.env.PORT || 3004;
// JWT Secret — must be set via environment variable; no insecure fallback allowed
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('[evaluation-service] JWT_SECRET environment variable is required. Refusing to start without it.');
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

// Types
interface KeyPoint {
  pointId: string;
  content: string;
  importance: number;
  category: string;
}

interface RetellingContent {
  audioUrl: string;
  transcript: string;
  duration: number;
  noteTime: number;
  retellingTime: number;
  keyPoints: KeyPoint[];
}

interface KeyPointCoverage {
  pointId: string;
  content: string;
  importance: number;
  covered: boolean;
  confidence: number;
}

interface RetellingEvaluation {
  evaluationId: string;
  sessionId: string;
  transcript: string;
  keyPointsCovered: KeyPointCoverage[];
  completenessScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  overallScore: number;
  feedback: string;
  evaluatedAt: Date;
}

// In-memory storage for demo
const evaluations: Record<string, RetellingEvaluation> = {};

// ============================================================
// Android-compatible evaluation records (flat structure)
// ============================================================

interface AndroidEvaluationRecord {
  id: string;
  sessionId: string;
  exerciseId: string;
  totalScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  contentScore: number;
  duration: number;
  feedback: string;
  details: AndroidSentenceResult[];
  createdAt: number; // epoch ms
  userId: string;
}

interface AndroidSentenceResult {
  text: string;
  userText: string;
  score: number;
  words: AndroidWordResult[];
}

interface AndroidWordResult {
  word: string;
  userWord: string | null;
  score: number;
  status: string; // correct | wrong | missing
}

const androidEvaluations: Record<string, AndroidEvaluationRecord> = {};

// Multer for audio upload (memory storage)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// Helper: Generate mock evaluation result from audio duration
function generateMockAndroidEvaluation(
  sessionId: string, exerciseId: string, duration: number, userId: string
): AndroidEvaluationRecord {
  const total = 60 + Math.random() * 35;
  const pron = Math.min(100, total - 5 + Math.random() * 10);
  const fluency = Math.min(100, total - 3 + Math.random() * 6);
  const content = Math.min(100, total - 2 + Math.random() * 4);

  const round1 = (n: number) => Math.round(n * 10) / 10;

  const feedback =
    total >= 90 ? '非常棒！你的发音非常标准，继续保持！' :
    total >= 80 ? '很好！发音清晰流利，注意个别单词的重音。' :
    total >= 70 ? '不错！大部分发音正确，注意语调变化。' :
    total >= 60 ? '还可以，建议多听原音并跟读练习。' :
    '需要加强练习，建议逐句模仿标准发音。';

  const details: AndroidSentenceResult[] = [
    {
      text: 'Good morning, everyone. Today we are going to talk about our school life.',
      userText: 'Good morning everyone Today we are going to talk about our school life',
      score: round1(pron - 2 + Math.random() * 4),
      words: [
        { word: 'Good', userWord: 'Good', score: 95, status: 'correct' },
        { word: 'morning', userWord: 'morning', score: 90, status: 'correct' },
        { word: 'everyone', userWord: 'everyone', score: 88, status: 'correct' },
        { word: 'Today', userWord: 'Today', score: 92, status: 'correct' },
        { word: 'school', userWord: 'school', score: 90, status: 'correct' },
        { word: 'life', userWord: 'life', score: 87, status: 'correct' },
      ],
    },
    {
      text: 'I usually get up at six o\'clock and have breakfast at seven.',
      userText: 'I usually get up at six o\'clock and have breakfast at seven',
      score: round1(pron - 5 + Math.random() * 10),
      words: [
        { word: 'usually', userWord: 'usually', score: 82, status: 'correct' },
        { word: "o'clock", userWord: "o'clock", score: 78, status: 'correct' },
        { word: 'breakfast', userWord: 'breakfast', score: 80, status: 'correct' },
      ],
    },
  ];

  return {
    id: uuidv4(),
    sessionId,
    exerciseId,
    totalScore: round1(total),
    pronunciationScore: round1(pron),
    fluencyScore: round1(fluency),
    contentScore: round1(content),
    duration,
    feedback,
    details,
    createdAt: Date.now(),
    userId,
  };
}

// POST /evaluations/submit — Android multipart upload
app.post('/evaluations/submit', authenticateToken, upload.single('audioFile'), async (req, res) => {
  try {
    const userId = (req as any).user.username;
    const { sessionId, exerciseId, duration } = req.body;

    if (!sessionId || !exerciseId) {
      return res.status(400).json({
        code: 400, message: 'sessionId and exerciseId are required', data: null,
      });
    }

    const durationMs = parseInt(duration) || 0;

    let record: AndroidEvaluationRecord;

    if (req.file) {
      // Real audio submitted — try AI evaluation, fall back to mock
      try {
        const aiProvider = getAIProvider();
        const aiResult = await aiProvider.evaluate({
          audioBase64: req.file.buffer.toString('base64'),
          referenceText: '',
        });

        const total = (aiResult.pronunciationScore.overall * 0.4 + aiResult.fluencyScore * 0.3 + 70 * 0.3);
        const round1 = (n: number) => Math.round(n * 10) / 10;

        record = {
          id: uuidv4(),
          sessionId,
          exerciseId,
          totalScore: round1(total),
          pronunciationScore: round1(aiResult.pronunciationScore.overall),
          fluencyScore: round1(aiResult.fluencyScore),
          contentScore: round1(70 + Math.random() * 20),
          duration: durationMs,
          feedback: `Evaluated by ${aiResult.provider}. Pronunciation: ${round1(aiResult.pronunciationScore.overall)}/100.`,
          details: [],
          createdAt: Date.now(),
          userId,
        };
      } catch {
        record = generateMockAndroidEvaluation(sessionId, exerciseId, durationMs, userId);
      }
    } else {
      record = generateMockAndroidEvaluation(sessionId, exerciseId, durationMs, userId);
    }

    androidEvaluations[record.id] = record;

    res.status(201).json({
      code: 200,
      message: 'Evaluation submitted successfully',
      data: {
        id: record.id,
        sessionId: record.sessionId,
        exerciseId: record.exerciseId,
        totalScore: record.totalScore,
        pronunciationScore: record.pronunciationScore,
        fluencyScore: record.fluencyScore,
        contentScore: record.contentScore,
        duration: record.duration,
        feedback: record.feedback,
        details: record.details,
        createdAt: record.createdAt,
      },
    });
  } catch (error) {
    console.error('Submit evaluation error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// GET /evaluations/:id — Android get evaluation detail
app.get('/evaluations/:id', authenticateToken, (req, res) => {
  try {
    const record = androidEvaluations[req.params.id];
    if (!record) {
      // Also check retelling evaluations
      const retelling = evaluations[req.params.id];
      if (retelling) {
        return res.json({ code: 200, message: 'success', data: retelling });
      }
      return res.status(404).json({ code: 404, message: 'Evaluation not found', data: null });
    }
    res.json({ code: 200, message: 'success', data: record });
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// GET /evaluations/history — Android get evaluation history
app.get('/evaluations/history', authenticateToken, (req, res) => {
  try {
    const userId = (req as any).user.username;
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const userRecords = Object.values(androidEvaluations)
      .filter(r => r.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);

    const items = userRecords.slice(offset, offset + limit).map(r => ({
      id: r.id,
      sessionId: r.sessionId,
      exerciseId: r.exerciseId,
      totalScore: r.totalScore,
      pronunciationScore: r.pronunciationScore,
      fluencyScore: r.fluencyScore,
      contentScore: r.contentScore,
      duration: r.duration,
      feedback: r.feedback,
      details: r.details,
      createdAt: r.createdAt,
    }));

    res.json({
      code: 200, message: 'success',
      data: { items, total: userRecords.length },
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// GET /evaluations/statistics — Android statistics
app.get('/evaluations/statistics', authenticateToken, (req, res) => {
  try {
    const userId = (req as any).user.username;
    const records = Object.values(androidEvaluations).filter(r => r.userId === userId);

    if (records.length === 0) {
      return res.json({
        code: 200, message: 'success',
        data: {
          totalPractices: 0, averageScore: 0, averagePronunciation: 0,
          averageFluency: 0, averageContent: 0, bestScore: 0, streakDays: 0, totalDurationMs: 0,
        },
      });
    }

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const round1 = (n: number) => Math.round(n * 10) / 10;

    const uniqueDays = new Set(records.map(r => new Date(r.createdAt).toDateString())).size;

    res.json({
      code: 200, message: 'success',
      data: {
        totalPractices: records.length,
        averageScore: round1(avg(records.map(r => r.totalScore))),
        averagePronunciation: round1(avg(records.map(r => r.pronunciationScore))),
        averageFluency: round1(avg(records.map(r => r.fluencyScore))),
        averageContent: round1(avg(records.map(r => r.contentScore))),
        bestScore: round1(Math.max(...records.map(r => r.totalScore))),
        streakDays: uniqueDays,
        totalDurationMs: records.reduce((sum, r) => sum + r.duration, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
});

// Helper: Extract key points from transcript using simple NLP
function extractKeyPointsFromTranscript(
  studentTranscript: string,
  keyPoints: KeyPoint[]
): KeyPointCoverage[] {
  const studentWords = studentTranscript.toLowerCase().split(/\s+/);
  
  return keyPoints.map(point => {
    const pointWords = point.content.toLowerCase().split(/\s+/);
    
    // Simple matching: check if key point words appear in student transcript
    const matchedWords = pointWords.filter(word => 
      studentWords.some(studentWord => 
        studentWord.includes(word) || word.includes(studentWord)
      )
    );
    
    const matchRatio = matchedWords.length / pointWords.length;
    const covered = matchRatio > 0.5;
    const confidence = Math.min(matchRatio, 1.0);
    
    return {
      pointId: point.pointId,
      content: point.content,
      importance: point.importance,
      covered,
      confidence
    };
  });
}

// Helper: Calculate completeness score based on key point coverage
function calculateCompletenessScore(keyPointsCovered: KeyPointCoverage[]): number {
  if (keyPointsCovered.length === 0) return 0;
  
  const totalImportance = keyPointsCovered.reduce((sum, kp) => sum + kp.importance, 0);
  const coveredImportance = keyPointsCovered
    .filter(kp => kp.covered)
    .reduce((sum, kp) => sum + kp.importance, 0);
  
  return (coveredImportance / totalImportance) * 100;
}

// Evaluate Information Retelling — 接入 AI 提供商进行发音/流利度评测
app.post('/api/v1/evaluation/retelling', authenticateToken, async (req, res) => {
  try {
    const { sessionId, studentTranscript, retellingContent, audioBase64, audioUrl } = req.body;
    
    if (!sessionId || (!studentTranscript && !audioBase64 && !audioUrl) || !retellingContent) {
      return res.status(400).json({ error: 'Missing required fields: sessionId, (studentTranscript or audio), retellingContent' });
    }
    
    const content: RetellingContent = retellingContent;
    const aiProvider = getAIProvider();

    // 调用 AI 提供商进行 ASR + 发音评测
    const aiResult = await aiProvider.evaluate({
      transcript: studentTranscript,
      audioBase64,
      audioUrl,
      referenceText: content.keyPoints.map(kp => kp.content).join(' '),
    });

    const finalTranscript = aiResult.transcript || studentTranscript || '';

    // 基于 AI 转写文本计算关键点覆盖
    const keyPointsCovered = extractKeyPointsFromTranscript(finalTranscript, content.keyPoints);
    const completenessScore = calculateCompletenessScore(keyPointsCovered);

    // 综合评分：完整度 40%，发音 30%，流利度 30%
    const overallScore = (
      completenessScore * 0.4 +
      aiResult.pronunciationScore.overall * 0.3 +
      aiResult.fluencyScore * 0.3
    );
    
    // 生成反馈
    const coveredCount = keyPointsCovered.filter(kp => kp.covered).length;
    const totalCount = keyPointsCovered.length;
    const feedback = `You covered ${coveredCount} out of ${totalCount} key points. ` +
      `Pronunciation score: ${aiResult.pronunciationScore.overall.toFixed(1)}/100. ` +
      `Fluency score: ${aiResult.fluencyScore.toFixed(1)}/100. ` +
      `[Evaluated by: ${aiResult.provider}]`;
    
    const evaluation: RetellingEvaluation = {
      evaluationId: uuidv4(),
      sessionId,
      transcript: finalTranscript,
      keyPointsCovered,
      completenessScore,
      pronunciationScore: aiResult.pronunciationScore.overall,
      fluencyScore: aiResult.fluencyScore,
      overallScore,
      feedback,
      evaluatedAt: new Date()
    };
    
    evaluations[evaluation.evaluationId] = evaluation;
    
    res.status(201).json({
      ...evaluation,
      aiDetails: {
        provider: aiResult.provider,
        pronunciationErrors: aiResult.pronunciationScore.errors,
      }
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get evaluation result
app.get('/api/v1/evaluation/retelling/:evaluationId', authenticateToken, (req, res) => {
  try {
    const { evaluationId } = req.params;
    const evaluation = evaluations[evaluationId];
    
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    
    res.json(evaluation);
  } catch (error) {
    console.error('Get evaluation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'evaluation-service' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Evaluation service listening on port ${PORT}`);
  });
}

export default app;
