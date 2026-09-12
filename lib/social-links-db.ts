let migration: Promise<void> | undefined;

export function ensureSocialLinkColumns(db: D1Database) {
  migration ??= addSocialLinkColumns(db);
  return migration;
}

async function addSocialLinkColumns(db: D1Database) {
  const info = await db.prepare('PRAGMA table_info(stores)').all<{ name: string }>();
  const columns = new Set(info.results.map((column) => column.name));
  const additions = [
    ['location_url', "ALTER TABLE stores ADD COLUMN location_url TEXT NOT NULL DEFAULT ''"],
    ['tiktok_url', "ALTER TABLE stores ADD COLUMN tiktok_url TEXT NOT NULL DEFAULT ''"],
  ] as const;
  for (const [name, sql] of additions) {
    if (!columns.has(name)) await db.prepare(sql).run();
  }
}
