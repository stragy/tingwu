export { logger, createLogger } from './logger';
export { initTracing } from './tracing';
export declare enum ExerciseType {
    READING_ALOUD = "reading_aloud",
    SITUATIONAL_QA = "situational_qa",
    INFORMATION_RETELLING = "information_retelling",
    ROLE_PLAY = "role_play"
}
export interface UserProfileData {
    userId: string;
    name: string;
    grade: number;
    school: string;
    targetExamDate: Date;
    baselineLevel?: ProficiencyLevel;
    currentLevel?: ProficiencyLevel;
}
export interface ProficiencyLevel {
    overall: number;
    pronunciation: number;
    fluency: number;
    intonation: number;
    comprehension: number;
}
export declare enum SessionStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed"
}
export interface EvaluationResult {
    evaluationId: string;
    sessionId: string;
    overallScore: number;
    dimensionScores: DimensionScores;
    transcript: string;
    errors: Error[];
    feedback: string;
    evaluatedAt: Date;
}
export interface DimensionScores {
    pronunciation: number;
    fluency: number;
    intonation: number;
    completeness: number;
}
export interface Error {
    errorId: string;
    type: ErrorType;
    description: string;
    correction: string;
    severity: number;
}
export declare enum ErrorType {
    PRONUNCIATION = "pronunciation",
    GRAMMAR = "grammar",
    VOCABULARY = "vocabulary",
    FLUENCY = "fluency",
    CONTENT = "content"
}
export { User } from './entities/User';
export { AuthToken } from './entities/AuthToken';
export { UserProfile } from './entities/UserProfile';
export { PracticeSession } from './entities/PracticeSession';
export { EvaluationRecord } from './entities/EvaluationRecord';
export { LearningPath } from './entities/LearningPath';
export { ErrorPattern } from './entities/ErrorPattern';
export { MockExamRecord } from './entities/MockExamRecord';
export { ExerciseContentEntity } from './entities/ExerciseContent';
//# sourceMappingURL=index.d.ts.map