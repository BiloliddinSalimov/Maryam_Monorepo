-- CreateTable: ProductCategory (Many-to-Many pivot)
CREATE TABLE "ProductCategory" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId","categoryId")
);

-- Migrate existing categoryId data to ProductCategory
INSERT INTO "ProductCategory" ("productId", "categoryId")
SELECT "id", "categoryId" FROM "Product" WHERE "categoryId" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Product — categoryId ustunini olib tashlash
ALTER TABLE "Product" DROP COLUMN "categoryId";
