-- AlterTable
ALTER TABLE "CategoryContent" ADD COLUMN     "category_id" INTEGER;

-- AlterTable
ALTER TABLE "CollectionContent" ADD COLUMN     "collection_id" INTEGER;

-- AddForeignKey
ALTER TABLE "CategoryContent" ADD CONSTRAINT "CategoryContent_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionContent" ADD CONSTRAINT "CollectionContent_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "Collection"("collection_id") ON DELETE SET NULL ON UPDATE CASCADE;
