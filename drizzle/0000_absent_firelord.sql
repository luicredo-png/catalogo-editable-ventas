CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` integer NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`old_price` real NOT NULL,
	`image` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_products_store_sort` ON `products` (`store_id`,`sort_order`,`id`);--> statement-breakpoint
CREATE TABLE `stores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`owner_email` text NOT NULL,
	`slug` text NOT NULL,
	`name` text DEFAULT 'Mi tienda' NOT NULL,
	`whatsapp` text DEFAULT '51999999999' NOT NULL,
	`accent` text DEFAULT '#ef6a3a' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stores_owner_id_unique` ON `stores` (`owner_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `stores_slug_unique` ON `stores` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_stores_slug` ON `stores` (`slug`);