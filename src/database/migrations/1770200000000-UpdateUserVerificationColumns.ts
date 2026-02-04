import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserVerificationColumns1770200000000 implements MigrationInterface {
  name = 'UpdateUserVerificationColumns1770200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "email_verification_sent_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "phone_verification_sent_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_users_phone" UNIQUE ("phone")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_users_phone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "phone_verification_sent_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "email_verification_sent_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`,
    );
  }
}
