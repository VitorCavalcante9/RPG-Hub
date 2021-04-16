import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCharacters1618489985709 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "characters",
      columns: [
        {
          name: "id",
          type: "varchar",
          isPrimary: true,
          generationStrategy: "uuid"
        },
        {
          name: "rpg_id",
          type: "varchar",
          generationStrategy: "uuid"
        },
        {
          name: "icon",
          type: "varchar",
          isNullable: true
        },
        {
          name: "inventory",
          type: "json",
          isNullable: true
        },
        {
          name: "status",
          type: "json"
        },
        {
          name: "skills",
          type: "json"
        }
      ],
      foreignKeys:[
        {
          name: "rpg_character_fk",
          referencedTableName: "rpgs",
          referencedColumnNames: ["id"],
          columnNames: ["rpg_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("characters")
  }

}
