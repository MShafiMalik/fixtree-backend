import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1770104650877 implements MigrationInterface {
  name = 'CreateUsersTable1770104650877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('BUYER', 'SELLER', 'ADMIN', 'SUPER_ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying(255), "name" character varying(100) NOT NULL, "phone" character varying(30), "role" "public"."users_role_enum" NOT NULL DEFAULT 'BUYER', "is_email_verified" boolean NOT NULL DEFAULT false, "is_phone_verified" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "google_id" character varying(255), "profile_image" text, "country" character varying(100), "state" character varying(100), "city" character varying(100), "postal_code" character varying(20), "address" character varying(255), "accepts_marketing_emails" boolean NOT NULL DEFAULT false, "email_verification_token" character varying(255), "email_verification_expires" TIMESTAMP WITH TIME ZONE, "password_reset_token" character varying(255), "password_reset_expires" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_0bd5012aeb82628e07f6a1be53b" UNIQUE ("google_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0bd5012aeb82628e07f6a1be53" ON "users" ("google_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0bd5012aeb82628e07f6a1be53"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
