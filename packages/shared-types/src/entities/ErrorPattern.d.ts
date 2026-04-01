import { ErrorType } from '../index.js';
export interface ErrorOccurrence {
    sessionId: string;
    timestamp: Date;
    context: string;
    correction: string;
}
export declare class ErrorPattern {
    patternId: string;
    userId: string;
    errorType: ErrorType;
    category: string;
    description: string;
    occurrences: ErrorOccurrence[];
    frequency: number;
    severity: number;
    status: string;
    firstDetected: Date;
    lastDetected: Date;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=ErrorPattern.d.ts.map