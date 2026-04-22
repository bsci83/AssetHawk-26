import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    const result = await turso.execute({
      sql: `SELECT wo.*, a.name as asset_name, a.asset_tag 
            FROM work_orders wo 
            LEFT JOIN assets a ON wo.asset_id = a.id 
            WHERE a.org_id = ? 
            ORDER BY wo.created_at DESC`,
      args: [orgId]
    });
    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { assetId, title, description, priority, assignedToUserId, createdByUserId } = await req.json();
    
    const id = generateId();
    await turso.execute({
      sql: `INSERT INTO work_orders (id, asset_id, title, description, priority, assigned_to_user_id, created_by_user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [id, assetId, title, description, priority || 'medium', assignedToUserId, createdByUserId]
    });

    await turso.execute({
      sql: `INSERT INTO audit_log (id, action, entity_type, entity_id, description) VALUES (?, 'create', 'work_order', ?, ?)`,
      args: [generateId(), id, `Created work order: ${title}`]
    });

    return NextResponse.json({ success: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
