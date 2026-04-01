import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserProfilesTable1710880001000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE user_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                grade INTEGER NOT NULL,
                school VARCHAR(255),
                target_exam_date DATE,
                baseline_level JSONB,
                current_level JSONB,
                learning_path JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_user_profiles_grade ON user_profiles(grade);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX idx_user_profiles_grade`);
        await queryRunner.query(`DROP INDEX idx_user_profiles_user_id`);
        await queryRunner.query(`DROP TABLE user_profiles`);
    }
}