import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnSheetInCharacters1629916213783
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'characters',
      new TableColumn({
        name: 'sheet',
        type: 'json',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'characters',
      new TableColumn({
        name: 'sheet',
        type: 'json',
      })
    );
  }
}
