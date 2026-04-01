import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.js';
import { ExerciseType } from '../index.js';

export interface ExamSection {
  sectionId: string;
  type: ExerciseType;
  questions: ExamQuestion[];
  score: number;
  timeSpent: number;
}

export interface ExamQuestion {
  questionId: string;
  exerciseId: string;
  sessionId: string;
  evaluationId: string;
  score: number;
  timeSpent: number;
}

export interface ExamRanking {
  percentile: number;
  rank: number;
  totalParticipants: number;
  comparisonGroup: string;
}

export interface ExamFeedback {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  estimatedActualScore: number;
  confidenceInterval: [number, number];
}

export interface ExamComparison {
  previousExamId: string;
  scoreChange: number;
  dimensionChanges: {
    [dimension: string]: number;
  };
  improvementAreas: string[];
  regressionAreas: string[];
}

@Entity('mock_exam_records')
export class MockExamRecord {
  @PrimaryGeneratedColumn('uuid')
  examId: string;

  @Column()
  userId: string;

  @Column({ type: 'timestamp' })
  examDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  overallScore: number;

  @Column({ type: 'jsonb' })
  sectionScores: {
    [key in ExerciseType]: number;
  };

  @Column({ type: 'jsonb' })
  sections: ExamSection[];

  @Column({ type: 'jsonb' })
  ranking: ExamRanking;

  @Column({ type: 'jsonb' })
  feedback: ExamFeedback;

  @Column({ type: 'jsonb', nullable: true })
  comparisonToPrevious?: ExamComparison;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
