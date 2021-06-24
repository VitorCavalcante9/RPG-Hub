import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class RemoveColumnsImage1624448484386 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', new TableColumn({
      name: 'icon',
      type: 'varchar',
      isNullable: true
    }));
    await queryRunner.dropColumn('rpgs', new TableColumn({
      name: 'icon',
      type: 'varchar',
      isNullable: true
    }));
    await queryRunner.dropColumn('characters', new TableColumn({
      name: 'icon',
      type: 'varchar',
      isNullable: true
    }));
    await queryRunner.dropColumn('scenarios', new TableColumn({
      name: 'image',
      type: 'varchar',
      isNullable: true
    }));
    await queryRunner.dropColumn('objects', new TableColumn({
      name: 'image',
      type: 'varchar',
      isNullable: true
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'icon',
      type: 'varchar',
      isNullable: true
    }));
    await queryRunner.addColumn('rpgs', new TableColumn({
      name: 'icon',
      type: 'varchar',
      isNullable: true
    }));
    await queryRunner.addColumn('characters', new TableColumn({
      name: 'icon',
      type: 'varchar',
      isNullable: true
    }));
    await queryRunner.addColumn('scenarios', new TableColumn({
      name: 'image',
      type: 'varchar',
      isNullable: true
    }));
    await queryRunner.addColumn('objects', new TableColumn({
      name: 'image',
      type: 'varchar',
      isNullable: true
    }));
  }

}
