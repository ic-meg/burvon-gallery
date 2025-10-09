/*
  Warnings:

  - The values [tryon] on the enum `ContentSection` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContentSection_new" AS ENUM ('homepage', 'hero', 'promo', 'categories', 'collections');
ALTER TABLE "ContentManagement" ALTER COLUMN "section" TYPE "ContentSection_new" USING ("section"::text::"ContentSection_new");
ALTER TYPE "ContentSection" RENAME TO "ContentSection_old";
ALTER TYPE "ContentSection_new" RENAME TO "ContentSection";
DROP TYPE "public"."ContentSection_old";
COMMIT;
