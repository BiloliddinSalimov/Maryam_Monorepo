-- Translation jadvallarini o'chirish
DROP TABLE IF EXISTS "ProductTranslation";
DROP TABLE IF EXISTS "CategoryTranslation";
DROP TABLE IF EXISTS "BannerTranslation";
DROP TABLE IF EXISTS "HomepageSectionTranslation";

-- Category.name: TEXT → JSONB (mavjud qiymatlar uz kalit ostiga ko'chiriladi)
ALTER TABLE "Category" ALTER COLUMN "name" TYPE JSONB
  USING jsonb_build_object('uz', "name"::text);

-- Product.name: TEXT → JSONB
ALTER TABLE "Product" ALTER COLUMN "name" TYPE JSONB
  USING jsonb_build_object('uz', "name"::text);

-- Product.description: TEXT → JSONB (NULL qoladi NULL)
ALTER TABLE "Product" ALTER COLUMN "description" TYPE JSONB
  USING CASE
    WHEN "description" IS NOT NULL THEN jsonb_build_object('uz', "description"::text)
    ELSE NULL
  END;

-- Banner.title: TEXT → JSONB
ALTER TABLE "Banner" ALTER COLUMN "title" TYPE JSONB
  USING jsonb_build_object('uz', "title"::text);

-- HomepageSection.title: TEXT → JSONB (NULL qoladi NULL)
ALTER TABLE "HomepageSection" ALTER COLUMN "title" TYPE JSONB
  USING CASE
    WHEN "title" IS NOT NULL THEN jsonb_build_object('uz', "title"::text)
    ELSE NULL
  END;
