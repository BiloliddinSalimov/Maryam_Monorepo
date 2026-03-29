-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTranslation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryTranslation" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannerTranslation" (
    "id" TEXT NOT NULL,
    "bannerId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "BannerTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomepageSectionTranslation" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "title" TEXT,

    CONSTRAINT "HomepageSectionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTranslation_productId_languageCode_key" ON "ProductTranslation"("productId", "languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_languageCode_key" ON "CategoryTranslation"("categoryId", "languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "BannerTranslation_bannerId_languageCode_key" ON "BannerTranslation"("bannerId", "languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "HomepageSectionTranslation_sectionId_languageCode_key" ON "HomepageSectionTranslation"("sectionId", "languageCode");

-- AddForeignKey
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerTranslation" ADD CONSTRAINT "BannerTranslation_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BannerTranslation" ADD CONSTRAINT "BannerTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomepageSectionTranslation" ADD CONSTRAINT "HomepageSectionTranslation_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "HomepageSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomepageSectionTranslation" ADD CONSTRAINT "HomepageSectionTranslation_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;
