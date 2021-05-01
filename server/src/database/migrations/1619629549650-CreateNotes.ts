import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateNotes1619629549650 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "notes",
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
          name: "user_id",
          type: "varchar",
          generationStrategy: "uuid"
        },
        {
          name: "rpg_participant_id",
          type: "varchar",
          generationStrategy: "uuid",
          isNullable: true
        },
        {
          name: "notes",
          type: "json",
          isNullable: true
        }
      ],
      foreignKeys: [
        {
          name: "user_notes_fk",
          referencedTableName: "users",
          referencedColumnNames: ["id"],
          columnNames: ["user_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        {
          name: "rpg_notes_fk",
          referencedTableName: "rpgs",
          referencedColumnNames: ["id"],
          columnNames: ["rpg_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        },
        {
          name: "rpg_participant_notes_fk",
          referencedTableName: "rpg_participants",
          referencedColumnNames: ["id"],
          columnNames: ["rpg_participant_id"],
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      ]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("notes");
  }

}
