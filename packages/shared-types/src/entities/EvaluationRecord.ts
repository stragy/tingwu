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
import { PracticeSession } from './PracticeSession.js';
import { ErrorType } from '../index.js';

export interface DimensionScore {
  score: number;
  details: ScoreDetail[];
  suggestions: string[];
}

export interface ScoreDetail {
  metric: string;
  value: number;
  threshold?: number;
  feedback: string;
}

export interface Error {
  errorId: string;
  type: ErrorType;
  category: string;
  location: ErrorLocation;
  description: string;
  correction: string;
  severity: number;
}

export interface ErrorLocation {
  startTime: number;
  endTime: number;
  word?: string;
  phoneme?: string;
}

export interface DetailedFeedback {
  summary: string;
  dimensionFeedback: {
    pronunciation: string;
    fluency: string;
    intonation: string;
    completeness: string;
  };
  actionableSteps: string[];
  comparisonToBaseline: {
    scoreChange: number;
    improvement: string;
  };
  estimatedImprovement: string;
}

export interface ModelVersionInfo {
  asrVersion: string;
  pronunciationVersion: string;
  nlpVersion: string;
  evaluationFrameworkVersion: string;
}

@Entity('evaluation_records')
export class EvaluationRecord {
  @PrimaryGeneratedColumn('uuid')
  evaluationId: string;

  @Column()
  sessionId: string;

  @Column()
  userId: string;

  @Column()
  exerciseId: string;

  @Column({ nullable: true })
  recordingId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  overallScore: number;

  @Column({ type: 'jsonb' })
  dimensionScores: {
    pronunciation: DimensionScore;
    fluency: DimensionScore;
    intonation: DimensionScore;
    completeness: DimensionScore;
  };

  @Column({ type: 'text' })
  transcript: string;

  @Column({ type: 'jsonb' })
  errors: Error[];

  @Column({ type: 'jsonb' })
  feedback: DetailedFeedback;

  @Column({ type: 'timestamp' })
  evaluatedAt: Date;

  @Column({ type: 'integer', nullable: true })
  evaluationDuration: number;

  @Column({ type: 'jsonb', nullable: true })
  modelVersions: ModelVersionInfo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
