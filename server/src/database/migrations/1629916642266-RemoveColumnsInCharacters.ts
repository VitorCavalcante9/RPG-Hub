import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveColumnsInCharacters1629916642266
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('characters', [
      new TableColumn({
        name: 'status',
        type: 'json',
      }),
      new TableColumn({
        name: 'skills',
        type: 'json',
      }),
      new TableColumn({
        name: 'inventory',
        type: 'json',
      }),
      new TableColumn({
        name: 'limitOfPoints',
        type: 'integer',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('characters', [
      new TableColumn({
        name: 'status',
        type: 'json',
      }),
      new TableColumn({
        name: 'skills',
        type: 'json',
      }),
      new TableColumn({
        name: 'inventory',
        type: 'json',
      }),
      new TableColumn({
        name: 'limitOfPoints',
        type: 'integer',
      }),
    ]);
  }
}
