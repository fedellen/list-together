import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1615490999169 implements MigrationInterface {
    name = 'Initial1615490999169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_to_list" ("userId" uuid NOT NULL, "listId" uuid NOT NULL, "privileges" text NOT NULL, "recentlyAddedItems" text, "sortedItems" text, "removedItems" text, CONSTRAINT "PK_4e9a8028cc0aa7f7cc49d5d3762" PRIMARY KEY ("userId", "listId"))`);
        await queryRunner.query(`CREATE TABLE "lists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, CONSTRAINT "PK_268b525e9a6dd04d0685cb2aaaa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "notes" text, "strike" boolean NOT NULL DEFAULT false, "listId" uuid, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "item_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "item" text NOT NULL, "timesAdded" integer NOT NULL DEFAULT '1', "removalRatingArray" text, "userToListUserId" uuid, "userToListListId" uuid, CONSTRAINT "PK_9798ae25eb8cdd79f7b86600145" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL, "email" text NOT NULL, "sortedListsArray" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_to_list" ADD CONSTRAINT "FK_d308ea23576b985c50c490497b2" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_to_list" ADD CONSTRAINT "FK_f25bb152d56f3382cd4f9234978" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_c896260841b4b4f6344fab64dea" FOREIGN KEY ("listId") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item_history" ADD CONSTRAINT "FK_605d93c2bfd045a3d22b4efc587" FOREIGN KEY ("userToListUserId", "userToListListId") REFERENCES "user_to_list"("userId","listId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "item_history" DROP CONSTRAINT "FK_605d93c2bfd045a3d22b4efc587"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_c896260841b4b4f6344fab64dea"`);
        await queryRunner.query(`ALTER TABLE "user_to_list" DROP CONSTRAINT "FK_f25bb152d56f3382cd4f9234978"`);
        await queryRunner.query(`ALTER TABLE "user_to_list" DROP CONSTRAINT "FK_d308ea23576b985c50c490497b2"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "item_history"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP TABLE "lists"`);
        await queryRunner.query(`DROP TABLE "user_to_list"`);
    }

}
