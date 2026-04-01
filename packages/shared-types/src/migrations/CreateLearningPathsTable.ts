import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLearningPathsTable1704067200006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'learning_paths',
        columns: [
          {
            name: 'path_id',
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
            name: 'start_date',
            type: 'date',
          },
          {
            name: 'target_date',
            type: 'date',
          },
          {
            name: 'current_phase',
            type: 'jsonb',
          },
          {
            name: 'milestones',
            type: 'jsonb',
          },
          {
            name: 'adaptations',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
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
      'learning_paths',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['user_id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('learning_paths', 'user_id');
    await queryRunner.dropTable('learning_paths');
  }
}
