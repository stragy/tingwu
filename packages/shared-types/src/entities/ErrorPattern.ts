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
import { ErrorType } from '../index.js';

export interface ErrorOccurrence {
  sessionId: string;
  timestamp: Date;
  context: string;
  correction: string;
}

@Entity('error_patterns')
export class ErrorPattern {
  @PrimaryGeneratedColumn('uuid')
  patternId: string;

  @Column()
  userId: string;

  @Column()
  errorType: ErrorType;

  @Column()
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  occurrences: ErrorOccurrence[];

  @Column()
  frequency: number;

  @Column()
  severity: number;

  @Column()
  status: string; // 'active', 'improving', 'resolved'

  @Column({ type: 'timestamp', nullable: true })
  firstDetected: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastDetected: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
