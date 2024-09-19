const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class SchemaUpdate1726784701316 {
    name = 'SchemaUpdate1726784701316'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (0), "newField" boolean NOT NULL DEFAULT ('new'))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "email", "password", "admin", "newField") SELECT "id", "email", "password", "admin", "newField" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (0), "newField" varchar NOT NULL DEFAULT ('new'))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "email", "password", "admin", "newField") SELECT "id", "email", "password", "admin", "newField" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (0), "newField" boolean NOT NULL DEFAULT ('new'))`);
        await queryRunner.query(`INSERT INTO "user"("id", "email", "password", "admin", "newField") SELECT "id", "email", "password", "admin", "newField" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (0), "newField" boolean NOT NULL DEFAULT ('new'))`);
        await queryRunner.query(`INSERT INTO "user"("id", "email", "password", "admin", "newField") SELECT "id", "email", "password", "admin", "newField" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }
}
