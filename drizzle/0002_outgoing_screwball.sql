DROP INDEX `stores_owner_id_unique`;--> statement-breakpoint
ALTER TABLE `stores` ADD `template_key` text DEFAULT 'ropa' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_stores_owner_template` ON `stores` (`owner_id`,`template_key`);--> statement-breakpoint
ALTER TABLE `products` ADD `options_json` text DEFAULT '[]' NOT NULL;