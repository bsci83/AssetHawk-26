const { createClient } = require('@libsql/client');
const client = createClient({
  url: 'libsql://assethawk-bifill.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzY3OTMzMzksImlkIjoiMDE5ZGIxMjItOTYwMS03N2UzLThjNjAtMDhkOTQ5MTI5M2UyIiwicmlkIjoiMDVlMTA0ZTgtYzIyYi00MzFjLTkxMzctMjVhNzU3OGJlNGFmIn0.6HgCivTBIwfKX1t8n92YdunXdcqxLAHByjv4iR84SOIQ6hk0cOeFpZWotV01ZrklB1ocF6lVq9bavBG-mGd4AQ'
});

async function setup() {
  // Templates table
  await client.execute(`CREATE TABLE IF NOT EXISTS templates (
    id TEXT PRIMARY KEY,
    org_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    fields TEXT DEFAULT '[]',
    is_public INTEGER DEFAULT 0,
    use_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
  console.log('Templates table created');
  
  // Seed some public templates
  const templates = [
    { name: 'IT Equipment', desc: 'Standard IT asset tracking template', category: 'Technology', use_count: 1247 },
    { name: 'Office Furniture', desc: 'Track desks, chairs, and equipment', category: 'Furniture', use_count: 834 },
    { name: 'Lab Equipment', desc: 'Scientific equipment tracking', category: 'Research', use_count: 423 },
    { name: 'Event Equipment', desc: 'Rental and event gear tracking', category: 'Events', use_count: 612 },
    { name: 'Medical Devices', desc: 'HIPAA-compliant medical asset tracking', category: 'Healthcare', use_count: 298 },
  ];
  
  for (const t of templates) {
    try {
      await client.execute({
        sql: 'INSERT INTO templates (id, name, description, category, is_public, use_count) VALUES (?, ?, ?, ?, 1, ?)',
        args: [crypto.randomUUID(), t.name, t.desc, t.category, t.use_count]
      });
    } catch (e) {
      // Ignore duplicates
    }
  }
  console.log('Seeded public templates');
}

setup().then(() => process.exit(0)).catch(console.error);
