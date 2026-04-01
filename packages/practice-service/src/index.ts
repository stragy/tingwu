import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

dotenv.config({ path: '../../.env' });

export const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'practice-service' });
});

// JWT Secret — must be set via environment variable; no insecure fallback allowed
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    '[practice-service] JWT_SECRET environment variable is required. Refusing to start without it.'
  );
}

// S3 Client configuration
const s3Client = new S3Client({
  endpoint: process.env.AWS_ENDPOINT || 'http://localhost:4566',
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
  },
  forcePathStyle: true,
});

// Types
interface RetellingSession {
  sessionId: string;
  userId: string;
  exerciseId: string;
  status: 'preparation' | 'note_taking' | 'retelling' | 'completed';
  startTime: Date;
  noteStartTime?: Date;
  noteEndTime?: Date;
  retellingStartTime?: Date;
  retellingEndTime?: Date;
  recording?: AudioRecording;
  transcript?: string;
}

interface AudioRecording {
  recordingId: string;
  url: string;
  duration: number;
  format: string;
  sampleRate: number;
  uploadedAt: Date;
}

// In-memory storage for demo (replace with database in production)
const sessions: Record<string, any> = {};
const retellingSessions: Record<string, RetellingSession> = {};

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

// Audio upload middleware
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/x-wav'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only WAV and MP3 are allowed.'));
    }
  },
});

// Audio quality validation
const validateAudioQuality = (
  buffer: Buffer,
  mimetype: string
): { valid: boolean; message?: string } => {
  // Check file size (minimum 1KB)
  if (buffer.length < 1024) {
    return { valid: false, message: 'Audio file too small (minimum 1KB)' };
  }

  // Check file size (maximum 50MB)
  if (buffer.length > 50 * 1024 * 1024) {
    return { valid: false, message: 'Audio file too large (maximum 50MB)' };
  }

  // Check MIME type
  const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/x-wav'];
  if (!allowedTypes.includes(mimetype)) {
    return { valid: false, message: 'Invalid file type. Only WAV and MP3 are allowed.' };
  }

  // For WAV files, check sample rate (minimum 16kHz)
  if (mimetype === 'audio/wav' || mimetype === 'audio/x-wav') {
    // Basic WAV header check (simplified)
    // WAV header: RIFF....WAVEfmt ... (first 12 bytes)
    // Sample rate is at bytes 24-27 (little-endian)
    if (buffer.length >= 28) {
      const sampleRate = buffer.readUInt32LE(24);
      if (sampleRate < 16000) {
        return { valid: false, message: 'Sample rate must be at least 16kHz' };
      }
    }
  }

  return { valid: true };
};

// Preprocess audio (simplified - in production, use audio processing library)
const preprocessAudio = async (buffer: Buffer): Promise<Buffer> => {
  // In production, this would:
  // 1. Convert to 16kHz sample rate if needed
  // 2. Convert to mono if stereo
  // 3. Normalize volume
  // 4. Remove background noise
  return buffer;
};

// Upload audio endpoint
app.post('/api/v1/audio/upload', authenticateToken, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Validate audio quality
    const qualityCheck = validateAudioQuality(req.file.buffer, req.file.mimetype);
    if (!qualityCheck.valid) {
      return res
        .status(400)
        .json({ error: 'Audio quality validation failed', details: qualityCheck.message });
    }

    // Preprocess audio
    const processedBuffer = await preprocessAudio(req.file.buffer);

    // Generate unique filename
    const userId = (req as any).user.username;
    const sessionId = req.body.sessionId || Date.now().toString();
    const filename = `original.${req.file.originalname.split('.').pop()}`;
    const key = `audio-recordings/${userId}/${sessionId}/${filename}`;

    // Upload to S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME || 'tingwu-audio-recordings',
      Key: key,
      Body: processedBuffer,
      ContentType: req.file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Generate presigned URL for download
    const getParams = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || 'tingwu-audio-recordings',
      Key: key,
    });
    const presignedUrl = await getSignedUrl(s3Client, getParams, { expiresIn: 3600 });

    // Store metadata
    const recordingMetadata = {
      recordingId: sessionId,
      userId,
      sessionId,
      filename: req.file.originalname,
      url: presignedUrl,
      size: processedBuffer.length,
      mimetype: req.file.mimetype,
      duration: req.body.duration || 0,
      sampleRate: req.body.sampleRate || 16000,
      uploadedAt: new Date(),
    };

    sessions[sessionId] = {
      ...sessions[sessionId],
      recording: recordingMetadata,
    };

    res.status(201).json({
      message: 'Audio uploaded successfully',
      recording: recordingMetadata,
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get audio metadata endpoint
app.get('/api/v1/audio/:recordingId', authenticateToken, (req, res) => {
  try {
    const { recordingId } = req.params;
    const userId = (req as any).user.username;

    // Find session with this recording
    const session = Object.values(sessions).find(
      (s: any) => s.recording?.recordingId === recordingId && s.recording?.userId === userId
    );

    if (!session) {
      return res.status(404).json({ error: 'Recording not found' });
    }

    res.json(session.recording);
  } catch (error) {
    console.error('Get audio metadata error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List user's audio recordings
app.get('/api/v1/audio', authenticateToken, (req, res) => {
  try {
    const userId = (req as any).user.username;

    const userRecordings = Object.values(sessions)
      .filter((s: any) => s.recording?.userId === userId)
      .map((s: any) => s.recording);

    res.json({ recordings: userRecordings, total: userRecordings.length });
  } catch (error) {
    console.error('List audio recordings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Information Retelling: Start session
app.post('/api/v1/practice/retelling/start', authenticateToken, (req, res) => {
  try {
    const { exerciseId } = req.body;
    const userId = (req as any).user.username;

    if (!exerciseId) {
      return res.status(400).json({ error: 'Exercise ID required' });
    }

    const sessionId = uuidv4();
    const retellingSession: RetellingSession = {
      sessionId,
      userId,
      exerciseId,
      status: 'preparation',
      startTime: new Date(),
    };

    retellingSessions[sessionId] = retellingSession;

    res.status(201).json({
      message: 'Retelling session started',
      session: retellingSession,
    });
  } catch (error) {
    console.error('Start retelling session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Information Retelling: Start note-taking phase
app.post('/api/v1/practice/retelling/:sessionId/start-notes', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = (req as any).user.username;

    const session = retellingSessions[sessionId];
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (session.status !== 'preparation') {
      return res.status(400).json({ error: 'Invalid session status' });
    }

    session.status = 'note_taking';
    session.noteStartTime = new Date();

    res.json({
      message: 'Note-taking phase started',
      session,
    });
  } catch (error) {
    console.error('Start note-taking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Information Retelling: End note-taking and start retelling
app.post('/api/v1/practice/retelling/:sessionId/start-retelling', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = (req as any).user.username;

    const session = retellingSessions[sessionId];
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (session.status !== 'note_taking') {
      return res.status(400).json({ error: 'Invalid session status' });
    }

    session.noteEndTime = new Date();
    session.status = 'retelling';
    session.retellingStartTime = new Date();

    res.json({
      message: 'Retelling phase started',
      session,
    });
  } catch (error) {
    console.error('Start retelling error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Information Retelling: Complete session
app.post('/api/v1/practice/retelling/:sessionId/complete', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = (req as any).user.username;

    const session = retellingSessions[sessionId];
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (session.status !== 'retelling') {
      return res.status(400).json({ error: 'Invalid session status' });
    }

    session.retellingEndTime = new Date();
    session.status = 'completed';

    res.json({
      message: 'Retelling session completed',
      session,
    });
  } catch (error) {
    console.error('Complete retelling error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get retelling session
app.get('/api/v1/practice/retelling/:sessionId', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = (req as any).user.username;

    const session = retellingSessions[sessionId];
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get retelling session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ======================================================
// Exercise Content — Static seed data (demo / dev mode)
// ======================================================

interface ExerciseItem {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  duration: number;
  coverUrl?: string;
}

interface ExerciseSentence {
  index: number;
  text: string;
  translation?: string;
  audioUrl?: string;
}

interface ExerciseDetail extends ExerciseItem {
  content: {
    instructions: string;
    sentences: ExerciseSentence[];
    audioUrl?: string;
  };
}

const EXERCISES: ExerciseDetail[] = [
  {
    id: 'exercise_001',
    title: 'School Life Introduction',
    type: 'reading_aloud',
    difficulty: 'easy',
    duration: 60,
    content: {
      instructions: '请大声朗读以下段落，注意发音和语调。',
      sentences: [
        {
          index: 0,
          text: 'Good morning, everyone. Today we are going to talk about our school life.',
          translation: '大家早上好。今天我们来聊聊我们的学校生活。',
        },
        {
          index: 1,
          text: "I usually get up at six o'clock and have breakfast at seven.",
          translation: '我通常六点起床，七点吃早饭。',
        },
        {
          index: 2,
          text: 'My favorite subject is English because I enjoy reading stories.',
          translation: '我最喜欢的科目是英语，因为我喜欢读故事。',
        },
        {
          index: 3,
          text: 'After school, I often play basketball with my classmates.',
          translation: '放学后，我经常和同学们打篮球。',
        },
        {
          index: 4,
          text: 'I think school life is wonderful and I love learning new things every day.',
          translation: '我觉得学校生活很精彩，我喜欢每天学习新东西。',
        },
      ],
    },
  },
  {
    id: 'exercise_002',
    title: 'Environmental Protection',
    type: 'reading_aloud',
    difficulty: 'medium',
    duration: 90,
    content: {
      instructions: '请朗读以下短文，注意重音和停顿。',
      sentences: [
        {
          index: 0,
          text: "Protecting the environment is everyone's responsibility.",
          translation: '保护环境是每个人的责任。',
        },
        {
          index: 1,
          text: 'We should reduce, reuse, and recycle to save our planet.',
          translation: '我们应该减少、重复利用和回收来拯救我们的地球。',
        },
        {
          index: 2,
          text: 'Planting trees helps clean the air and prevents soil erosion.',
          translation: '植树有助于净化空气，防止水土流失。',
        },
        {
          index: 3,
          text: 'We must take action now before it is too late.',
          translation: '我们必须现在就采取行动，否则就太晚了。',
        },
      ],
    },
  },
  {
    id: 'exercise_003',
    title: 'Ordering at a Restaurant',
    type: 'situational_qa',
    difficulty: 'easy',
    duration: 120,
    content: {
      instructions: '假设你在餐厅点餐，请根据提示回答服务员的问题。',
      audioUrl: '/audio/exercises/exercise_003_question.mp3',
      sentences: [
        {
          index: 0,
          text: 'Waiter: Good evening! What would you like to order?',
          translation: '服务员：晚上好！您想点什么？',
        },
        {
          index: 1,
          text: "Sample answer: I'd like a bowl of fried rice and a glass of orange juice, please.",
          translation: '参考答案：我想要一碗炒饭和一杯橙汁。',
        },
      ],
    },
  },
  {
    id: 'exercise_004',
    title: 'Trip to Beijing',
    type: 'information_retelling',
    difficulty: 'medium',
    duration: 180,
    content: {
      instructions: '听完录音后，用自己的话复述主要内容，包括时间、地点、人物和发生的事情。',
      audioUrl: '/audio/exercises/exercise_004_passage.mp3',
      sentences: [
        {
          index: 0,
          text: 'Last summer, Li Ming and his family visited Beijing for a week.',
          translation: '去年夏天，李明和家人去北京游玩了一周。',
        },
        {
          index: 1,
          text: 'They visited the Great Wall, the Forbidden City, and the Summer Palace.',
          translation: '他们参观了长城、故宫和颐和园。',
        },
        {
          index: 2,
          text: 'Li Ming was amazed by the history and beauty of these places.',
          translation: '李明对这些地方的历史和美丽感到惊叹。',
        },
        {
          index: 3,
          text: 'He took many photos and bought souvenirs for his friends.',
          translation: '他拍了很多照片，还为朋友们买了纪念品。',
        },
        {
          index: 4,
          text: 'This trip made Li Ming love Chinese history even more.',
          translation: '这次旅行让李明更加热爱中国历史。',
        },
      ],
    },
  },
  {
    id: 'exercise_005',
    title: 'Talking about Hobbies',
    type: 'role_play',
    difficulty: 'easy',
    duration: 150,
    content: {
      instructions: '与朋友进行关于兴趣爱好的对话，至少交流4轮。',
      sentences: [
        {
          index: 0,
          text: 'Role: You are talking with a new friend about hobbies.',
          translation: '角色：你正在和一个新朋友聊兴趣爱好。',
        },
        {
          index: 1,
          text: 'Starter: Hi! What do you like to do in your free time?',
          translation: '开场白：嗨！你空闲时喜欢做什么？',
        },
      ],
    },
  },
  {
    id: 'exercise_006',
    title: 'Climate Change Discussion',
    type: 'situational_qa',
    difficulty: 'hard',
    duration: 120,
    content: {
      instructions: '回答关于气候变化的问题，请使用至少3个观点支持你的答案。',
      audioUrl: '/audio/exercises/exercise_006_question.mp3',
      sentences: [
        {
          index: 0,
          text: 'Question: What can young people do to help fight climate change?',
          translation: '问题：年轻人可以做什么来帮助应对气候变化？',
        },
      ],
    },
  },
  {
    id: 'exercise_007',
    title: 'Technology in Modern Life',
    type: 'reading_aloud',
    difficulty: 'hard',
    duration: 90,
    content: {
      instructions: '请流畅地朗读以下段落，注意专业词汇的发音。',
      sentences: [
        {
          index: 0,
          text: 'Technology has transformed the way we live, work, and communicate.',
          translation: '科技已经改变了我们生活、工作和交流的方式。',
        },
        {
          index: 1,
          text: 'Smartphones and the internet have made information accessible to everyone.',
          translation: '智能手机和互联网让每个人都能获取信息。',
        },
        {
          index: 2,
          text: 'Artificial intelligence is revolutionizing industries from healthcare to transportation.',
          translation: '人工智能正在革新从医疗到交通运输的各行各业。',
        },
        {
          index: 3,
          text: 'However, we must use technology responsibly and consider its impact on society.',
          translation: '然而，我们必须负责任地使用技术，并考虑其对社会的影响。',
        },
      ],
    },
  },
  {
    id: 'exercise_008',
    title: 'The Story of a Hero',
    type: 'information_retelling',
    difficulty: 'hard',
    duration: 200,
    content: {
      instructions: '听完故事后复述，要包含所有关键事件，并用自己的语言表达。',
      audioUrl: '/audio/exercises/exercise_008_passage.mp3',
      sentences: [
        {
          index: 0,
          text: 'During a flood, a firefighter named Wang Fang saved twelve people.',
          translation: '在一场洪水中，一名叫王芳的消防员救了十二个人。',
        },
        {
          index: 1,
          text: 'She worked for 36 hours without rest, carrying children and elderly people to safety.',
          translation: '她连续工作了36小时，把孩子和老人背到安全的地方。',
        },
        {
          index: 2,
          text: 'Her courage inspired the whole community to help each other.',
          translation: '她的勇气激励了整个社区互相帮助。',
        },
      ],
    },
  },
];

// Handler: list exercises with optional filtering
function handleListExercises(req: express.Request, res: express.Response) {
  try {
    const { type, difficulty, page = '1', pageSize = '20' } = req.query as Record<string, string>;
    let filtered = [...EXERCISES];

    if (type) filtered = filtered.filter((e) => e.type === type);
    if (difficulty) filtered = filtered.filter((e) => e.difficulty === difficulty);

    const pageNum = parseInt(page) || 1;
    const size = Math.min(parseInt(pageSize) || 20, 100);
    const start = (pageNum - 1) * size;
    const items = filtered.slice(start, start + size).map(({ content: _content, ...item }) => item);

    res.json({
      code: 200,
      message: 'success',
      data: {
        items,
        total: filtered.length,
        page: pageNum,
        pageSize: size,
      },
    });
  } catch (error) {
    console.error('List exercises error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
}

// Handler: get exercise detail by ID
function handleGetExerciseDetail(req: express.Request, res: express.Response) {
  try {
    const id = req.params.id;
    const exercise = EXERCISES.find((e) => e.id === id);
    if (!exercise) {
      return res.status(404).json({ code: 404, message: 'Exercise not found', data: null });
    }

    res.json({
      code: 200,
      message: 'success',
      data: exercise,
    });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ code: 500, message: 'Internal server error', data: null });
  }
}

// GET /exercises — list exercises (direct path, matched by Nginx /exercises rule)
app.get('/exercises', authenticateToken, handleListExercises);

// GET /exercises/:id — get exercise detail (direct path)
app.get('/exercises/:id', authenticateToken, handleGetExerciseDetail);

// GET /api/v1/practice/exercises — same, accessed via /api/v1/practice/ gateway prefix
app.get('/api/v1/practice/exercises', authenticateToken, handleListExercises);

// GET /api/v1/practice/exercises/:id — via gateway prefix
app.get('/api/v1/practice/exercises/:id', authenticateToken, handleGetExerciseDetail);

// =====================================================
// Role-Play Sessions
// =====================================================

interface RolePlaySession {
  sessionId: string;
  userId: string;
  exerciseId: string;
  status: 'active' | 'completed';
  turns: Array<{ role: 'user' | 'ai'; text: string; timestamp: Date }>;
  startTime: Date;
  endTime?: Date;
}

const rolePlaySessions: Record<string, RolePlaySession> = {};

// Start Role-Play session
app.post('/api/v1/practice/roleplay/start', authenticateToken, (req, res) => {
  try {
    const { exerciseId } = req.body;
    const userId = (req as any).user.username;

    if (!exerciseId) {
      return res.status(400).json({ error: 'Exercise ID required' });
    }

    const sessionId = uuidv4();
    const session: RolePlaySession = {
      sessionId,
      userId,
      exerciseId,
      status: 'active',
      turns: [],
      startTime: new Date(),
    };

    rolePlaySessions[sessionId] = session;

    res.status(201).json({ message: 'Role-play session started', session });
  } catch (error) {
    console.error('Start role-play error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit user turn and get AI response
app.post('/api/v1/practice/roleplay/:sessionId/turn', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userText } = req.body;
    const userId = (req as any).user.username;

    const session = rolePlaySessions[sessionId];
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.userId !== userId) return res.status(403).json({ error: 'Unauthorized' });
    if (session.status !== 'active')
      return res.status(400).json({ error: 'Session is not active' });
    if (!userText) return res.status(400).json({ error: 'userText is required' });

    // Record user turn
    session.turns.push({ role: 'user', text: userText, timestamp: new Date() });

    // Generate simple AI response (mock dialogue partner)
    const aiResponses: Record<string, string[]> = {
      hobby: [
        'That sounds interesting! I love doing that too. How often do you practice?',
        "Wow, that's cool! Do you have any other hobbies?",
        'I see. I enjoy reading books in my free time. What about you?',
        "That's great! Have you ever joined a club for that?",
      ],
      default: [
        'Really? Tell me more about that.',
        "That's interesting! What do you think about it?",
        'I agree with you. Have you experienced anything similar?',
        'Good point! What else would you like to share?',
      ],
    };

    const responses = aiResponses['default'];
    const aiText = responses[session.turns.length % responses.length];
    session.turns.push({ role: 'ai', text: aiText, timestamp: new Date() });

    res.json({
      aiResponse: aiText,
      turnCount: Math.floor(session.turns.length / 2),
      session,
    });
  } catch (error) {
    console.error('Role-play turn error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete Role-Play session
app.post('/api/v1/practice/roleplay/:sessionId/complete', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = (req as any).user.username;

    const session = rolePlaySessions[sessionId];
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.userId !== userId) return res.status(403).json({ error: 'Unauthorized' });

    session.status = 'completed';
    session.endTime = new Date();

    res.json({ message: 'Role-play session completed', session });
  } catch (error) {
    console.error('Complete role-play error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Role-Play session
app.get('/api/v1/practice/roleplay/:sessionId', authenticateToken, (req, res) => {
  try {
    const session = rolePlaySessions[req.params.sessionId];
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.userId !== (req as any).user.username)
      return res.status(403).json({ error: 'Unauthorized' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Practice service listening on port ${PORT}`);
  });
}

export default app;
