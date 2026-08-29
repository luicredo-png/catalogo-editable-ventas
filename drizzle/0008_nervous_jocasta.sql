ALTER TABLE `stores` ADD `collection_background_color` text DEFAULT '#050b14' NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` ADD `collection_background_image` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` ADD `collection_motion` text DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` ADD `collection_overlay_strength` real DEFAULT 0.35 NOT NULL;--> statement-breakpoint
UPDATE `stores` SET `collection_background_color` = `background_color`;
