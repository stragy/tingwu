import { SessionStatus, ExerciseType } from '../index.js';
export interface AudioRecording {
    recordingId: string;
    url: string;
    duration: number;
    format: string;
    sampleRate: number;
    uploadedAt: Date;
}
export declare class PracticeSession {
    sessionId: string;
    userId: string;
    exerciseId: string;
    exerciseType: ExerciseType;
    startTime: Date;
    endTime: Date;
    status: SessionStatus;
    recording: AudioRecording;
    evaluationId: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=PracticeSession.d.ts.map