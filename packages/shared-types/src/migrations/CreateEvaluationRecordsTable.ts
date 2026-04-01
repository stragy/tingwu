import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateEvaluationRecordsTable1704067200004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'evaluation_records',
        columns: [
          {
            name: 'evaluation_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'session_id',
            type: 'uuid',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'exercise_id',
            type: 'uuid',
          },
          {
            name: 'recording_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'overall_score',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'dimension_scores',
            type: 'jsonb',
          },
          {
            name: 'transcript',
            type: 'text',
          },
          {
            name: 'errors',
            type: 'jsonb',
          },
          {
            name: 'feedback',
            type: 'jsonb',
          },
          {
            name: 'evaluated_at',
            type: 'timestamp',
          },
          {
            name: 'evaluation_duration',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'model_versions',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'evaluation_records',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['user_id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'evaluation_records',
      new TableForeignKey({
        columnNames: ['session_id'],
        referencedColumnNames: ['session_id'],
        referencedTableName: 'practice_sessions',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('evaluation_records', 'user_id');
    await queryRunner.dropForeignKey('evaluation_records', 'session_id');
    await queryRunner.dropTable('evaluation_records');
  }
}
