import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User;

    @Column()
    name: string;

    @Column()
    grade: number;

    @Column({ nullable: true })
    school: string;

    @Column({ nullable: true })
    targetExamDate: Date;

    @Column("jsonb", { nullable: true })
    baselineLevel: Record<string, any>;

    @Column("jsonb", { nullable: true })
    currentLevel: Record<string, any>;

    @Column("jsonb", { nullable: true })
    learningPath: Record<string, any>;
}