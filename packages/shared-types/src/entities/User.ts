import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from './UserProfile';
import { AuthToken } from './AuthToken';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column()
  grade: number;

  @Column({ nullable: true })
  school: string | null;

  @Column({ nullable: true })
  targetExamDate: Date | null;

  @Column('jsonb', { nullable: true })
  baselineLevel: Record<string, any> | null;

  @Column('jsonb', { nullable: true })
  currentLevel: Record<string, any> | null;

  @Column('jsonb', { nullable: true })
  learningPath: Record<string, any> | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  @JoinColumn()
  profile: UserProfile;

  @OneToMany(() => AuthToken, (token) => token.user)
  tokens: AuthToken[];
}
