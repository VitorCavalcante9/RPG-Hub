import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateImages1624448050115 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'images',
      columns: [
        {
          name: 'id',
          type: 'integer',
          unsigned: true,
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment"
        },
        {
          name: "rpg_id",
          type: "varchar",
          generationStrategy: "uuid",
          isNullable: true
        },
        {
          name: "character_id",
          type: "varchar",
          generationStrategy: "uuid",
          isNullable: true
        },
        {
          name: "user_id",
          type: "varchar",
          generationStrategy: "uuid",
          isNullable: true
        },  
        {
          name: "scenario_id",
          type: "integer",
          unsigned: true,
          isNullable: true
        },
        {
          name: "object_id",
          type: "integer",
          unsigned: true,
          isNullable: true
        },
        {
          name: 'name',
          type: 'varchar'
        },
        {
          name: 'key',
          type: 'varchar'
        },
        {
          name: 'url',
          type: 'varchar'
        }
      ],
      foreignKeys: [
        {
          name: "rpg_image_fk",
          referencedTableName: "rpgs",
          referencedColumnNames: ["id"],
          columnNames: ["rpg_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        {
          name: "character_image_fk",
          referencedTableName: "characters",
          referencedColumnNames: ["id"],
          columnNames: ["character_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        {
          name: "user_image_fk",
          referencedTableName: "users",
          referencedColumnNames: ["id"],
          columnNames: ["user_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        {
          name: "scenario_image_fk",
          referencedTableName: "scenarios",
          referencedColumnNames: ["id"],
          columnNames: ["scenario_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        {
          name: "object_image_fk",
          referencedTableName: "objects",
          referencedColumnNames: ["id"],
          columnNames: ["object_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("images");
  }

}
