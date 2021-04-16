import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateRpgParticipants1618491187997 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "rpg_participants",
      columns: [
        {
          name: "user_id",
          type: "varchar",
          generationStrategy: "uuid"
        },
        {
          name: "rpg_id",
          type: "varchar",
          generationStrategy: "uuid"
        },
        {
          name: "character_id",
          type: "varchar",
          generationStrategy: "uuid",
          isNullable: true
        }
      ],
      foreignKeys: [
        {
          name: "user_fk",
          referencedTableName: "users",
          referencedColumnNames: ["id"],
          columnNames: ["user_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        {
          name: "rpg_fk",
          referencedTableName: "rpgs",
          referencedColumnNames: ["id"],
          columnNames: ["rpg_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        {
          name: "character_fk",
          referencedTableName: "characters",
          referencedColumnNames: ["id"],
          columnNames: ["character_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("rpg_participants");
  }

}
