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
export type ExerciseContent = ReadingAloudContent | SituationalQAContent | RetellingContent | RolePlayContent;
export declare class ExerciseContentEntity {
    contentId: string;
    type: ExerciseType;
    title: string;
    description: string;
    difficulty: number;
    content: ExerciseContent;
    metadata: ContentMetadata;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=ExerciseContent.d.ts.map