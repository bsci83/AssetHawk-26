import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    const result = await turso.execute({
      sql: `SELECT u.id, u.email, u.first_name, u.last_name, u.role, uo.role as org_role, uo.is_active, uo.joined_at
            FROM users u
            JOIN user_orgs uo ON u.id = uo.user_id
            WHERE uo.org_id = ?`,
      args: [orgId]
    });
    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orgId, email, firstName, lastName, role } = await req.json();
    
    // Check if user exists
    const existing = await turso.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] });
    
    let userId;
    if (existing.rows.length > 0) {
      userId = existing.rows[0].id;
    } else {
      // Create placeholder user (in real app would send invitation email)
      userId = generateId();
      await turso.execute({
        sql: `INSERT INTO users (id, email, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)`,
        args: [userId, email, firstName || 'New', lastName || 'User', 'user']
      });
    }

    // Add to organization
    const id = generateId();
    await turso.execute({
      sql: `INSERT INTO user_orgs (id, user_id, org_id, role) VALUES (?, ?, ?, ?)`,
      args: [id, userId, orgId, role || 'user']
    });

    await turso.execute({
      sql: `INSERT INTO audit_log (id, org_id, action, entity_type, entity_id, description) VALUES (?, ?, 'create', 'user_org', ?, ?)`,
      args: [generateId(), orgId, id, `Invited user: ${email}`]
    });

    return NextResponse.json({ success: true, userId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, orgId, role, isActive } = await req.json();
    
    await turso.execute({
      sql: `UPDATE user_orgs SET role = ?, is_active = ? WHERE user_id = ? AND org_id = ?`,
      args: [role, isActive ? 1 : 0, userId, orgId]
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const orgId = searchParams.get('orgId');
    
    await turso.execute({
      sql: `UPDATE user_orgs SET is_active = 0 WHERE user_id = ? AND org_id = ?`,
      args: [userId, orgId]
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
