ALTER TABLE inventory_products ADD COLUMN image TEXT NOT NULL DEFAULT '';
ALTER TABLE inventory_products ADD COLUMN color TEXT NOT NULL DEFAULT '';
ALTER TABLE inventory_products ADD COLUMN size TEXT NOT NULL DEFAULT '';
ALTER TABLE inventory_products ADD COLUMN model TEXT NOT NULL DEFAULT '';
ALTER TABLE inventory_products ADD COLUMN catalog_url TEXT NOT NULL DEFAULT '';
ALTER TABLE inventory_products ADD COLUMN source_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_products_source_key ON inventory_products(source_key);
