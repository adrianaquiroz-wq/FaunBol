import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnimalsTable1791500000000 implements MigrationInterface {
  name = 'CreateAnimalsTable1791500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."animal_class_enum" AS ENUM('MAMMAL', 'BIRD', 'REPTILE', 'AMPHIBIAN', 'FISH')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."conservation_status_enum" AS ENUM('LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX', 'DD')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."population_trend_enum" AS ENUM('INCREASING', 'STABLE', 'DECREASING', 'UNKNOWN')`,
    );
    await queryRunner.query(`
      CREATE TABLE "animals" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "common_name" character varying(150) NOT NULL,
        "scientific_name" character varying(150) NOT NULL,
        "animal_class" "public"."animal_class_enum" NOT NULL,
        "description" text,
        "iucn_status" "public"."conservation_status_enum" NOT NULL,
        "bolivia_red_book_status" "public"."conservation_status_enum",
        "threats" text,
        "population_trend" "public"."population_trend_enum",
        "estimated_population" integer,
        "habitat" character varying(255) NOT NULL,
        "distribution" character varying(255) NOT NULL,
        "image_url" character varying(500),
        "source_reference" character varying(500) NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "UQ_animals_scientific_name" UNIQUE ("scientific_name"),
        CONSTRAINT "PK_animals_id" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "animals"`);
    await queryRunner.query(`DROP TYPE "public"."population_trend_enum"`);
    await queryRunner.query(`DROP TYPE "public"."conservation_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."animal_class_enum"`);
  }
}
