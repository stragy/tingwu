import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuthTokensTable1710880002000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE auth_tokens (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                refresh_token VARCHAR(500) UNIQUE NOT NULL,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                revoked BOOLEAN DEFAULT FALSE
            );
        `);

        await queryRunner.query(`
            CREATE INDEX idx_auth_tokens_user_id ON auth_tokens(user_id);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_auth_tokens_refresh_token ON auth_tokens(refresh_token);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_auth_tokens_expires_at ON auth_tokens(expires_at);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX idx_auth_tokens_expires_at`);
        await queryRunner.query(`DROP INDEX idx_auth_tokens_refresh_token`);
        await queryRunner.query(`DROP INDEX idx_auth_tokens_user_id`);
        await queryRunner.query(`DROP TABLE auth_tokens`);
    }
}