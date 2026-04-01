import { User } from './User';
export declare class AuthToken {
    id: number;
    userId: number;
    user: User;
    refreshToken: string;
    expiresAt: Date | null;
    revoked: boolean;
    metadata: Record<string, any> | null;
}
//# sourceMappingURL=AuthToken.d.ts.map