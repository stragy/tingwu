import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMockExamRecordsTable1704067200007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mock_exam_records',
        columns: [
          {
            name: 'exam_id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'exam_date',
            type: 'timestamp',
          },
          {
            name: 'overall_score',
            type: 'decimal',
            precision: 5,
            scale: 2,
          },
          {
            name: 'section_scores',
            type: 'jsonb',
          },
          {
            name: 'sections',
            type: 'jsonb',
          },
          {
            name: 'ranking',
            type: 'jsonb',
          },
          {
            name: 'feedback',
            type: 'jsonb',
          },
          {
            name: 'comparison_to_previous',
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
      'mock_exam_records',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['user_id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('mock_exam_records', 'user_id');
    await queryRunner.dropTable('mock_exam_records');
  }
}
