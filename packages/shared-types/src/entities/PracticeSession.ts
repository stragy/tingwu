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
import { ExerciseContentEntity } from './ExerciseContent.js';
import { SessionStatus, ExerciseType } from '../index.js';

export interface AudioRecording {
  recordingId: string;
  url: string;
  duration: number;
  format: string;
  sampleRate: number;
  uploadedAt: Date;
}

@Entity('practice_sessions')
export class PracticeSession {
  @PrimaryGeneratedColumn('uuid')
  sessionId: string;

  @Column()
  userId: string;

  @Column()
  exerciseId: string;

  @Column()
  exerciseType: ExerciseType;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column()
  status: SessionStatus;

  @Column({ type: 'jsonb', nullable: true })
  recording: AudioRecording;

  @Column({ type: 'uuid', nullable: true })
  evaluationId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
