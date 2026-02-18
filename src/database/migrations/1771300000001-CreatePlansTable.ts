import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePlansTable1771300000001 implements MigrationInterface {
  name = 'CreatePlansTable1771300000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "plans" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "name" character varying(255) NOT NULL,
        "country_id" uuid NOT NULL,
        "description" text,
        "service_limit" integer NOT NULL,
        "price" integer NOT NULL,
        "can_extend_booking_time" boolean NOT NULL DEFAULT false,
        "is_default" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_plans_name_country" UNIQUE ("name", "country_id"),
        CONSTRAINT "PK_plans" PRIMARY KEY ("id"),
        CONSTRAINT "FK_plans_country" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE
      )`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plans_name" ON "plans" ("name")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plans_country_id" ON "plans" ("country_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plans_is_default" ON "plans" ("is_default")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_plans_is_active" ON "plans" ("is_active")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_plans_deleted_at" ON "plans" ("deleted_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_plans_country_active" ON "plans" ("country_id", "is_active") WHERE "deleted_at" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_plans_country_active"`);
    await queryRunner.query(`DROP INDEX "public"."idx_plans_deleted_at"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plans_is_active"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plans_is_default"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plans_country_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_plans_name"`);
    await queryRunner.query(`DROP TABLE "plans"`);
  }
}
