ALTER TABLE stores ADD COLUMN button_style TEXT NOT NULL DEFAULT 'gradient';
ALTER TABLE stores ADD COLUMN secondary_button_style TEXT NOT NULL DEFAULT 'glow';
ALTER TABLE stores ADD COLUMN hero_button_style TEXT NOT NULL DEFAULT 'glow';
