import { MigrationInterface, QueryRunner } from "typeorm";

export class BusinessesAccess1736006319381 implements MigrationInterface {
    name = 'BusinessesAccess1736006319381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "businesses" DROP CONSTRAINT "FK_8881b96819252080592fe1592ea"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
                RENAME COLUMN "role" TO "default_business_id"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."users_role_enum"
            RENAME TO "users_default_business_id_enum"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."business_access_role_enum" AS ENUM('user', 'admin', 'owner')
        `);
        await queryRunner.query(`
            CREATE TABLE "business_access" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "business_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
                "role" "public"."business_access_role_enum" NOT NULL,
                CONSTRAINT "PK_720ccaaf20157cd4507dcd422e7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "businesses" DROP COLUMN "owner_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "default_business_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "default_business_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "business_access"
            ADD CONSTRAINT "FK_faa9e8fe890c5b76e587c206c64" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "business_access"
            ADD CONSTRAINT "FK_4449fce5fd74e912230e895a383" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "users" DROP COLUMN "default_business_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "default_business_id" "public"."users_default_business_id_enum" NOT NULL DEFAULT 'user'
        `);
        await queryRunner.query(`
            ALTER TABLE "businesses"
            ADD "owner_id" uuid NOT NULL
        `);
        await queryRunner.query(`
            DROP TABLE "business_access"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."business_access_role_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."users_default_business_id_enum"
            RENAME TO "users_role_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
                RENAME COLUMN "default_business_id" TO "role"
        `);
        await queryRunner.query(`
            ALTER TABLE "businesses"
            ADD CONSTRAINT "FK_8881b96819252080592fe1592ea" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
