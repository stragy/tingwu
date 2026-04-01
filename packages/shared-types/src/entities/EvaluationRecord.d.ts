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
export declare class EvaluationRecord {
    evaluationId: string;
    sessionId: string;
    userId: string;
    exerciseId: string;
    recordingId: string;
    overallScore: number;
    dimensionScores: {
        pronunciation: DimensionScore;
        fluency: DimensionScore;
        intonation: DimensionScore;
        completeness: DimensionScore;
    };
    transcript: string;
    errors: Error[];
    feedback: DetailedFeedback;
    evaluatedAt: Date;
    evaluationDuration: number;
    modelVersions: ModelVersionInfo;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=EvaluationRecord.d.ts.map