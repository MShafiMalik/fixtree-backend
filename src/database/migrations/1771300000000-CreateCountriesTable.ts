import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCountriesTable1771300000000 implements MigrationInterface {
  name = 'CreateCountriesTable1771300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "countries" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "name" character varying(100) NOT NULL,
        "code" character varying(10) NOT NULL,
        "currencyCode" character varying(10),
        "currencySymbol" character varying(10),
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_countries_code" UNIQUE ("code"),
        CONSTRAINT "PK_countries" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_countries_name" ON "countries" ("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_countries_code" ON "countries" ("code")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_countries_is_active" ON "countries" ("is_active")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_countries_deleted_at" ON "countries" ("deleted_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_countries_deleted_at"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_countries_is_active"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_countries_code"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_countries_name"`);
    await queryRunner.query(`DROP TABLE "countries"`);
  }
}
