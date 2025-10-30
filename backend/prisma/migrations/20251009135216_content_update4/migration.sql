/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `CategoryContent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `CollectionContent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `CategoryContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `CollectionContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryContent" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CollectionContent" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CategoryContent_slug_key" ON "CategoryContent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionContent_slug_key" ON "CollectionContent"("slug");
