import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName, orgName } = await req.json();

    if (!email || !password || !firstName || !lastName || !orgName) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 });
    }

    // Check if user exists
    const existing = await turso.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email]
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const userId = generateId();
    const orgId = generateId();
    const userOrgId = generateId();
    const slug = orgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const passwordHash = await hashPassword(password);

    // Create org first
    await turso.execute({
      sql: `INSERT INTO organizations (id, name, slug) VALUES (?, ?, ?)`,
      args: [orgId, orgName, slug]
    });

    // Create user
    await turso.execute({
      sql: `INSERT INTO users (id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)`,
      args: [userId, email, passwordHash, firstName, lastName]
    });

    // Link user to org
    await turso.execute({
      sql: `INSERT INTO user_orgs (id, user_id, org_id, role) VALUES (?, ?, ?, 'admin')`,
      args: [userOrgId, userId, orgId]
    });

    return NextResponse.json({ success: true, userId, orgId });
  } catch (e: any) {
    console.error('Signup error:', e);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
