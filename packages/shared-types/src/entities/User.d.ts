import { UserProfile } from './UserProfile';
import { AuthToken } from './AuthToken';
export declare class User {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
    name: string;
    grade: number;
    school: string | null;
    targetExamDate: Date | null;
    baselineLevel: Record<string, any> | null;
    currentLevel: Record<string, any> | null;
    learningPath: Record<string, any> | null;
    createdAt: Date;
    updatedAt: Date;
    profile: UserProfile;
    tokens: AuthToken[];
}
//# sourceMappingURL=User.d.ts.map