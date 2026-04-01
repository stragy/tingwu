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
export declare class LearningPath {
    pathId: string;
    userId: string;
    startDate: Date;
    targetDate: Date;
    currentPhase: LearningPhase;
    milestones: Milestone[];
    adaptations: PathAdaptation[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=LearningPath.d.ts.map