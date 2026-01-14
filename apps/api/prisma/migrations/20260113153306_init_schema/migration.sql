-- CreateTable
CREATE TABLE "styles" (
    "id" SERIAL NOT NULL,
    "style_no" VARCHAR(20) NOT NULL,
    "style_name" VARCHAR(100),
    "public_note" TEXT,
    "customer_id" INTEGER,
    "customer_name" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "color_variants" (
    "id" SERIAL NOT NULL,
    "style_id" INTEGER NOT NULL,
    "color_name" VARCHAR(50) NOT NULL,
    "sample_image_url" VARCHAR(500),
    "size_range" VARCHAR(100),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMP(3),
    "cloned_from_id" INTEGER,

    CONSTRAINT "color_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bom_items" (
    "id" SERIAL NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "material_name" VARCHAR(100) NOT NULL,
    "material_image_url" VARCHAR(500),
    "material_color_text" VARCHAR(50),
    "material_color_image_url" VARCHAR(500),
    "usage" DECIMAL(10,4) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "supplier" VARCHAR(100),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bom_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spec_details" (
    "id" SERIAL NOT NULL,
    "bom_item_id" INTEGER NOT NULL,
    "size" VARCHAR(20),
    "spec_value" VARCHAR(50) NOT NULL,
    "spec_unit" VARCHAR(20) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spec_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "customer_name" VARCHAR(100) NOT NULL,
    "contact_person" VARCHAR(50),
    "contact_phone" VARCHAR(30),
    "contact_email" VARCHAR(100),
    "address" TEXT,
    "note" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" INTEGER,
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sizes" (
    "id" SERIAL NOT NULL,
    "size_code" VARCHAR(20) NOT NULL,
    "size_name" VARCHAR(50) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "unit_code" VARCHAR(20) NOT NULL,
    "unit_name" VARCHAR(50) NOT NULL,
    "unit_type" VARCHAR(30),
    "note" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "supplier_name" VARCHAR(100) NOT NULL,
    "contact_person" VARCHAR(50),
    "contact_phone" VARCHAR(30),
    "contact_email" VARCHAR(100),
    "address" TEXT,
    "note" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" SERIAL NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "file_name" VARCHAR(200) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "file_type" VARCHAR(50) NOT NULL,
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "description" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operation_logs" (
    "id" SERIAL NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "before_data" JSONB,
    "after_data" JSONB,
    "change_note" TEXT,
    "operator_id" INTEGER,
    "operator_ip" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "styles_style_no_key" ON "styles"("style_no");

-- CreateIndex
CREATE INDEX "styles_customer_id_idx" ON "styles"("customer_id");

-- CreateIndex
CREATE INDEX "styles_style_no_idx" ON "styles"("style_no");

-- CreateIndex
CREATE INDEX "styles_created_at_idx" ON "styles"("created_at");

-- CreateIndex
CREATE INDEX "styles_deleted_at_idx" ON "styles"("deleted_at");

-- CreateIndex
CREATE INDEX "color_variants_style_id_idx" ON "color_variants"("style_id");

-- CreateIndex
CREATE INDEX "color_variants_deleted_at_idx" ON "color_variants"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "color_variants_style_id_color_name_key" ON "color_variants"("style_id", "color_name");

-- CreateIndex
CREATE INDEX "bom_items_variant_id_idx" ON "bom_items"("variant_id");

-- CreateIndex
CREATE INDEX "bom_items_material_name_idx" ON "bom_items"("material_name");

-- CreateIndex
CREATE INDEX "bom_items_deleted_at_idx" ON "bom_items"("deleted_at");

-- CreateIndex
CREATE INDEX "spec_details_bom_item_id_idx" ON "spec_details"("bom_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "spec_details_bom_item_id_size_key" ON "spec_details"("bom_item_id", "size");

-- CreateIndex
CREATE INDEX "customers_customer_name_idx" ON "customers"("customer_name");

-- CreateIndex
CREATE INDEX "customers_is_active_idx" ON "customers"("is_active");

-- CreateIndex
CREATE INDEX "customers_deleted_at_idx" ON "customers"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_size_code_key" ON "sizes"("size_code");

-- CreateIndex
CREATE INDEX "sizes_sort_order_idx" ON "sizes"("sort_order");

-- CreateIndex
CREATE INDEX "sizes_is_active_idx" ON "sizes"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "units_unit_code_key" ON "units"("unit_code");

-- CreateIndex
CREATE INDEX "units_unit_type_idx" ON "units"("unit_type");

-- CreateIndex
CREATE INDEX "units_is_active_idx" ON "units"("is_active");

-- CreateIndex
CREATE INDEX "suppliers_supplier_name_idx" ON "suppliers"("supplier_name");

-- CreateIndex
CREATE INDEX "suppliers_is_active_idx" ON "suppliers"("is_active");

-- CreateIndex
CREATE INDEX "attachments_entity_type_entity_id_idx" ON "attachments"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "attachments_deleted_at_idx" ON "attachments"("deleted_at");

-- CreateIndex
CREATE INDEX "operation_logs_entity_type_entity_id_idx" ON "operation_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "operation_logs_action_idx" ON "operation_logs"("action");

-- CreateIndex
CREATE INDEX "operation_logs_created_at_idx" ON "operation_logs"("created_at");

-- AddForeignKey
ALTER TABLE "styles" ADD CONSTRAINT "styles_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "color_variants" ADD CONSTRAINT "color_variants_style_id_fkey" FOREIGN KEY ("style_id") REFERENCES "styles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bom_items" ADD CONSTRAINT "bom_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "color_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spec_details" ADD CONSTRAINT "spec_details_bom_item_id_fkey" FOREIGN KEY ("bom_item_id") REFERENCES "bom_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
