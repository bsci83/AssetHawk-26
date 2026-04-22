import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    let sql = 'SELECT * FROM audit_log';
    const args: string[] = [];
    
    if (orgId) {
      sql += ' WHERE org_id = ?';
      args.push(orgId);
    }
    sql += ' ORDER BY created_at DESC LIMIT 100';
    
    const result = await turso.execute({ sql, args });
    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orgId, userId, action, entityType, entityId, description, oldValues, newValues, ipAddress } = await req.json();
    
    const id = generateId();
    await turso.execute({
      sql: `INSERT INTO audit_log (id, org_id, user_id, action, entity_type, entity_id, description, old_values, new_values, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, orgId, userId, action, entityType, entityId, description, oldValues ? JSON.stringify(oldValues) : null, newValues ? JSON.stringify(newValues) : null, ipAddress]
    });
    
    return NextResponse.json({ success: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
