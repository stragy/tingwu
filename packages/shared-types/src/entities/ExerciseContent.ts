import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExerciseType } from '../index.js';

export interface ReadingAloudContent {
  text: string;
  wordCount: number;
  preparationTime: number;
  readingTime: number;
  referenceAudioUrl?: string;
}

export interface SituationalQAContent {
  scenario: string;
  questionAudioUrl: string;
  questionText: string;
  thinkingTime: number;
  responseTime: number;
  sampleAnswers: string[];
  keyPoints: string[];
}

export interface KeyPoint {
  pointId: string;
  content: string;
  importance: number;
  category: string;
}

export interface RetellingContent {
  audioUrl: string;
  transcript: string;
  duration: number;
  noteTime: number;
  retellingTime: number;
  keyPoints: KeyPoint[];
}

export interface RolePlayContent {
  scenario: string;
  roleDescription: string;
  conversationStarters: string[];
  expectedTurns: number;
  timeLimit: number;
  evaluationCriteria: string[];
}

export interface ContentMetadata {
  examAlignment: string;
  skillsFocused: string[];
  estimatedDuration: number;
  usageCount: number;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ExerciseContent =
  | ReadingAloudContent
  | SituationalQAContent
  | RetellingContent
  | RolePlayContent;

@Entity('exercise_content')
export class ExerciseContentEntity {
  @PrimaryGeneratedColumn('uuid')
  contentId: string;

  @Column()
  type: ExerciseType;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  difficulty: number;

  @Column({ type: 'jsonb' })
  content: ExerciseContent;

  @Column({ type: 'jsonb', nullable: true })
  metadata: ContentMetadata;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
