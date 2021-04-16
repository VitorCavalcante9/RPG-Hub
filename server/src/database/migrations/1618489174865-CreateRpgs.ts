import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateRpgs1618489174865 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "rpgs",
      columns: [
        {
          name: "id",
          type: "varchar",
          isPrimary: true,
          generationStrategy: "uuid"
        },
        {
          name: "user_id",
          type: "varchar",
          generationStrategy: "uuid"
        },
        {
          name: "name",
          type: "varchar"
        },
        {
          name: "icon",
          type: "varchar",
          isNullable: true
        },
        {
          name: "sheet",
          type: "json"
        },
        {
          name: "dices",
          type: "json"
        }
      ],
      foreignKeys:[
        {
          name: "admin_fk",
          referencedTableName: "users",
          referencedColumnNames: ["id"],
          columnNames: ["user_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("rpgs")
  }

}
