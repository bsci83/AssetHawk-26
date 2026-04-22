/**
 * AssetHawk Database Schema - Deploy to Turso
 */
import { turso, generateId, now } from './turso';

export async function setupDatabase() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_orgs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      org_id TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      joined_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      asset_tag TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      qr_data TEXT,
      qr_url TEXT,
      custom_fields TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(org_id, asset_tag)
    );

    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      user_id TEXT,
      scan_method TEXT NOT NULL,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_assets_org ON assets(org_id);
    CREATE INDEX IF NOT EXISTS idx_scans_asset ON scans(asset_id);
  `;

  const statements = schema.split(';').filter(s => s.trim());
  for (const sql of statements) {
    if (sql.trim()) {
      try {
        await turso.execute(sql.trim());
        console.log('✓', sql.trim().substring(0, 50));
      } catch (e: any) {
        console.log('✗', e.message.substring(0, 60));
      }
    }
  }
}

// Run if executed directly
setupDatabase().then(() => {
  console.log('Database setup complete');
  process.exit(0);
}).catch(console.error);
