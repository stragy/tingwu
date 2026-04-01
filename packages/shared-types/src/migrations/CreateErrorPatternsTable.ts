import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateErrorPatternsTable1704067200005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'error_patterns',
        columns: [
          {
            name: 'pattern_id',
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
            name: 'error_type',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'category',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'occurrences',
            type: 'jsonb',
          },
          {
            name: 'frequency',
            type: 'integer',
          },
          {
            name: 'severity',
            type: 'integer',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'first_detected',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'last_detected',
            type: 'timestamp',
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
      'error_patterns',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['user_id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('error_patterns', 'user_id');
    await queryRunner.dropTable('error_patterns');
  }
}
