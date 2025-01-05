import { MigrationInterface, QueryRunner } from "typeorm";

export class RequestInfo1734869260214 implements MigrationInterface {
    name = 'RequestInfo1734869260214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "platform" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "ip" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "browser" text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens"
            ADD "device" text NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "device"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "browser"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "ip"
        `);
        await queryRunner.query(`
            ALTER TABLE "refresh_tokens" DROP COLUMN "platform"
        `);
    }

}
