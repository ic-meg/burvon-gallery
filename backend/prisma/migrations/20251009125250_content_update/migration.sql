/*
  Warnings:

  - You are about to drop the `ContentManagement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ContentManagement" DROP CONSTRAINT "ContentManagement_updated_by_fkey";

-- DropTable
DROP TABLE "public"."ContentManagement";

-- DropEnum
DROP TYPE "public"."ContentSection";

-- CreateTable
CREATE TABLE "HomepageContent" (
    "id" SERIAL NOT NULL,
    "logo_url" TEXT,
    "hero_images" JSONB,
    "title" TEXT,
    "description" TEXT,
    "promo_image" TEXT,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAccountUser_id" INTEGER,

    CONSTRAINT "HomepageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryContent" (
    "id" SERIAL NOT NULL,
    "category_images" JSONB,
    "title" TEXT,
    "description" TEXT,
    "promo_images" TEXT,
    "updated_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAccountUser_id" INTEGER,

    CONSTRAINT "CategoryContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionContent" (
    "id" SERIAL NOT NULL,
    "collection_image" JSONB,
    "title" TEXT,
    "description" TEXT,
    "promo_images" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAccountUser_id" INTEGER,

    CONSTRAINT "CollectionContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HomepageContent" ADD CONSTRAINT "HomepageContent_userAccountUser_id_fkey" FOREIGN KEY ("userAccountUser_id") REFERENCES "UserAccount"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryContent" ADD CONSTRAINT "CategoryContent_userAccountUser_id_fkey" FOREIGN KEY ("userAccountUser_id") REFERENCES "UserAccount"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionContent" ADD CONSTRAINT "CollectionContent_userAccountUser_id_fkey" FOREIGN KEY ("userAccountUser_id") REFERENCES "UserAccount"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
