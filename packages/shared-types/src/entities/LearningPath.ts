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

export interface LearningPhase {
  phaseId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  goals: PhaseGoal[];
  focus: string[];
  intensity: number;
}

export interface PhaseGoal {
  goalId: string;
  description: string;
  targetDate: Date;
  completed: boolean;
}

export interface Milestone {
  milestoneId: string;
  name: string;
  description: string;
  targetDate: Date;
  completionDate?: Date;
  criteria: MilestoneCriteria;
  status: string;
}

export interface MilestoneCriteria {
  minimumScore: number;
  requiredSessions: number;
  skillRequirements: {
    [skill: string]: number;
  };
}

export interface PathAdaptation {
  adaptationId: string;
  timestamp: Date;
  reason: string;
  changes: string[];
  triggeredBy: string;
}

@Entity('learning_paths')
export class LearningPath {
  @PrimaryGeneratedColumn('uuid')
  pathId: string;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  targetDate: Date;

  @Column({ type: 'jsonb' })
  currentPhase: LearningPhase;

  @Column({ type: 'jsonb' })
  milestones: Milestone[];

  @Column({ type: 'jsonb', nullable: true })
  adaptations: PathAdaptation[];

  @Column()
  status: string; // 'active', 'completed', 'paused'

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
