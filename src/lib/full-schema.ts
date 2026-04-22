/**
 * AssetHawk Full Schema - All Tables
 */
import { turso } from './turso';

export async function setupFullSchema() {
  const statements = [
    // Users
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,

    // Organizations
    `CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      settings TEXT DEFAULT '{}',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,

    // User-Organization relationship
    `CREATE TABLE IF NOT EXISTS user_orgs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      org_id TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      is_active INTEGER DEFAULT 1,
      joined_at TEXT DEFAULT (datetime('now'))
    )`,

    // Assets
    `CREATE TABLE IF NOT EXISTS assets (
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
      updated_at TEXT DEFAULT (datetime('now'))
    )`,

    // Audit log
    `CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      org_id TEXT,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      description TEXT,
      old_values TEXT,
      new_values TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`,

    // Maintenance schedules
    `CREATE TABLE IF NOT EXISTS maintenance_schedules (
      id TEXT PRIMARY KEY,
      asset_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      frequency_days INTEGER NOT NULL,
      last_maintenance TEXT,
      next_maintenance TEXT,
      assigned_to_user_id TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,

    // Maintenance records
    `CREATE TABLE IF NOT EXISTS maintenance_records (
      id TEXT PRIMARY KEY,
      schedule_id TEXT,
      asset_id TEXT NOT NULL,
      performed_by_user_id TEXT,
      performed_date TEXT NOT NULL,
      description TEXT,
      cost REAL,
      parts_used TEXT,
      notes TEXT,
      next_maintenance_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,

    // Work orders
    `CREATE TABLE IF NOT EXISTS work_orders (
      id TEXT PRIMARY KEY,
      asset_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      assigned_to_user_id TEXT,
      created_by_user_id TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,

    // Notifications
    `CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
  ];

  for (const sql of statements) {
    try {
      await turso.execute(sql);
    } catch (e: any) {
      console.log('Schema error:', e.message.substring(0, 60));
    }
  }
  console.log('Full schema setup complete');
}

setupFullSchema().then(() => process.exit(0)).catch(console.error);
