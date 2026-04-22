import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    // Get maintenance schedules with asset info
    const result = await turso.execute({
      sql: `SELECT ms.*, a.name as asset_name, a.asset_tag 
            FROM maintenance_schedules ms 
            JOIN assets a ON ms.asset_id = a.id 
            WHERE a.org_id = ? 
            ORDER BY ms.next_maintenance ASC`,
      args: [orgId]
    });
    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { assetId, name, description, frequencyDays, assignedToUserId } = await req.json();
    
    if (!assetId || !name || !frequencyDays) {
      return NextResponse.json({ error: 'assetId, name, frequencyDays required' }, { status: 400 });
    }

    const id = generateId();
    const nextMaintenance = new Date(Date.now() + frequencyDays * 24 * 60 * 60 * 1000).toISOString();
    
    await turso.execute({
      sql: `INSERT INTO maintenance_schedules (id, asset_id, name, description, frequency_days, next_maintenance, assigned_to_user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [id, assetId, name, description, frequencyDays, nextMaintenance, assignedToUserId]
    });

    // Log to audit
    await turso.execute({
      sql: `INSERT INTO audit_log (id, action, entity_type, entity_id, description) VALUES (?, 'create', 'maintenance_schedule', ?, ?)`,
      args: [generateId(), id, `Created maintenance schedule: ${name}`]
    });

    return NextResponse.json({ success: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    await turso.execute({ sql: 'DELETE FROM maintenance_schedules WHERE id = ?', args: [id] });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
