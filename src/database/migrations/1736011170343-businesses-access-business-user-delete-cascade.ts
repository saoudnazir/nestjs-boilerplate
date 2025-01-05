import { MigrationInterface, QueryRunner } from "typeorm";

export class BusinessesAccessBusinessUserDeleteCascade1736011170343 implements MigrationInterface {
    name = 'BusinessesAccessBusinessUserDeleteCascade1736011170343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "business_access" DROP CONSTRAINT "FK_faa9e8fe890c5b76e587c206c64"
        `);
        await queryRunner.query(`
            ALTER TABLE "business_access" DROP CONSTRAINT "FK_4449fce5fd74e912230e895a383"
        `);
        await queryRunner.query(`
            ALTER TABLE "business_access"
            ADD CONSTRAINT "FK_faa9e8fe890c5b76e587c206c64" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "business_access"
            ADD CONSTRAINT "FK_4449fce5fd74e912230e895a383" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "business_access" DROP CONSTRAINT "FK_4449fce5fd74e912230e895a383"
        `);
        await queryRunner.query(`
            ALTER TABLE "business_access" DROP CONSTRAINT "FK_faa9e8fe890c5b76e587c206c64"
        `);
        await queryRunner.query(`
            ALTER TABLE "business_access"
            ADD CONSTRAINT "FK_4449fce5fd74e912230e895a383" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "business_access"
            ADD CONSTRAINT "FK_faa9e8fe890c5b76e587c206c64" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
