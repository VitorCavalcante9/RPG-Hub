import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePermissionChange1619628033364 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "permission_change",
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
          name: "character_id",
          type: "varchar",
          generationStrategy: "uuid"
        },
        {
          name: "permission",
          type: "boolean",
          isNullable: true
        }
      ],
      foreignKeys: [
        {
          name: "rpg_permission_fk",
          referencedTableName: "rpgs",
          referencedColumnNames: ["id"],
          columnNames: ["rpg_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        {
          name: "character_permission_fk",
          referencedTableName: "characters",
          referencedColumnNames: ["id"],
          columnNames: ["character_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      ]
    }))  
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("permission_change");
  }

}
