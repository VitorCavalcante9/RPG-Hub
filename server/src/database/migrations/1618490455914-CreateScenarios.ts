import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateScenarios1618490455914 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "scenarios",
      columns: [
        {
          name: "id",
          type: "integer",
          unsigned: true,
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "rpg_id",
          type: "varchar",
          generationStrategy: "uuid"
        },
        {
          name: "name",
          type: "varchar"
        },
        {
          name: "image",
          type: "varchar"
        }
      ],
      foreignKeys: [
        {
          name: "rpg_scenario_fk",
          referencedTableName: "rpgs",
          referencedColumnNames: ["id"],
          columnNames: ["rpg_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("scenarios");
  }

}
