import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoriesTable1771240921346 implements MigrationInterface {
  name = 'CreateCategoriesTable1771240921346';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "description" text, "icon" character varying(255), "minimum_price" numeric(10,2), "maximum_price" numeric(10,2), "platform_commission_rate" numeric(5,2), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8b0be371d28245da6e4f4b6187" ON "categories" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_categories_deleted_at" ON "categories" ("deleted_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_categories_deleted_at"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8b0be371d28245da6e4f4b6187"`,
    );
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
