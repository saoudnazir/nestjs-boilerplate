import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpiresAtWithTimezone1734863479309 implements MigrationInterface {
  name = 'ExpiresAtWithTimezone1734863479309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "refresh_tokens" ALTER COLUMN "expires_at" TYPE TIMESTAMP WITH TIME ZONE
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "refresh_tokens" ALTER COLUMN "expires_at" TYPE TIMESTAMP
            `);
  }
}
