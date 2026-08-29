PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_stores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`owner_email` text NOT NULL,
	`template_key` text DEFAULT 'ropa' NOT NULL,
	`slug` text NOT NULL,
	`name` text DEFAULT 'Mi tienda' NOT NULL,
	`whatsapp` text DEFAULT '51999999999' NOT NULL,
	`accent` text DEFAULT '#168cff' NOT NULL,
	`background_color` text DEFAULT '#050b14' NOT NULL,
	`background_image` text DEFAULT '' NOT NULL,
	`font_family` text DEFAULT 'var(--font-outfit)' NOT NULL,
	`heading_font` text DEFAULT 'var(--font-space)' NOT NULL,
	`button_color` text DEFAULT '#25d366' NOT NULL,
	`secondary_color` text DEFAULT '#168cff' NOT NULL,
	`text_color` text DEFAULT '#ffffff' NOT NULL,
	`surface_color` text DEFAULT '#07111e' NOT NULL,
	`overlay_strength` real DEFAULT 0.62 NOT NULL,
	`catalog_title` text DEFAULT 'ÚLTIMOS MODELOS' NOT NULL,
	`logo_url` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_stores`("id", "owner_id", "owner_email", "template_key", "slug", "name", "whatsapp", "accent", "background_color", "background_image", "font_family", "catalog_title", "logo_url", "created_at") SELECT "id", "owner_id", "owner_email", "template_key", "slug", "name", "whatsapp", "accent", "background_color", "background_image", "font_family", "catalog_title", "logo_url", "created_at" FROM `stores`;--> statement-breakpoint
DROP TABLE `stores`;--> statement-breakpoint
ALTER TABLE `__new_stores` RENAME TO `stores`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `stores_slug_unique` ON `stores` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_stores_slug` ON `stores` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_stores_owner_template` ON `stores` (`owner_id`,`template_key`);
