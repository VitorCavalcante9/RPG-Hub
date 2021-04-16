import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateObjects1618491044661 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "objects",
      columns: [
        {
          name: "id",
          type: "integer",
          isPrimary: true,
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
          name: "rpg_object_fk",
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
    await queryRunner.dropTable("objects");
  }

}
