import { ExerciseType } from '../index.js';
export interface ExamSection {
    sectionId: string;
    type: ExerciseType;
    questions: ExamQuestion[];
    score: number;
    timeSpent: number;
}
export interface ExamQuestion {
    questionId: string;
    exerciseId: string;
    sessionId: string;
    evaluationId: string;
    score: number;
    timeSpent: number;
}
export interface ExamRanking {
    percentile: number;
    rank: number;
    totalParticipants: number;
    comparisonGroup: string;
}
export interface ExamFeedback {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    estimatedActualScore: number;
    confidenceInterval: [number, number];
}
export interface ExamComparison {
    previousExamId: string;
    scoreChange: number;
    dimensionChanges: {
        [dimension: string]: number;
    };
    improvementAreas: string[];
    regressionAreas: string[];
}
export declare class MockExamRecord {
    examId: string;
    userId: string;
    examDate: Date;
    overallScore: number;
    sectionScores: {
        [key in ExerciseType]: number;
    };
    sections: ExamSection[];
    ranking: ExamRanking;
    feedback: ExamFeedback;
    comparisonToPrevious?: ExamComparison;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=MockExamRecord.d.ts.map