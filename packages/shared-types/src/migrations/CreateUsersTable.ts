import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1710880000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
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
            CREATE INDEX idx_users_username ON users(username);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_users_email ON users(email);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_users_grade ON users(grade);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX idx_users_grade`);
        await queryRunner.query(`DROP INDEX idx_users_email`);
        await queryRunner.query(`DROP INDEX idx_users_username`);
        await queryRunner.query(`DROP TABLE users`);
    }
}