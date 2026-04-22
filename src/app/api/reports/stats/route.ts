import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    // Get real stats from actual data
    const assets = await turso.execute({
      sql: 'SELECT status, COUNT(*) as count FROM assets WHERE org_id = ? GROUP BY status',
      args: [orgId]
    });

    const totalAssets = await turso.execute({
      sql: 'SELECT COUNT(*) as count FROM assets WHERE org_id = ?',
      args: [orgId]
    });

    const maintenanceDue = await turso.execute({
      sql: `SELECT COUNT(*) as count FROM maintenance_schedules ms 
            JOIN assets a ON ms.asset_id = a.id 
            WHERE a.org_id = ? AND ms.is_active = 1`,
      args: [orgId]
    });

    const pendingWorkOrders = await turso.execute({
      sql: `SELECT COUNT(*) as count FROM work_orders wo 
            JOIN assets a ON wo.asset_id = a.id 
            WHERE a.org_id = ? AND wo.status IN ('pending', 'in_progress')`,
      args: [orgId]
    });

    const recentScans = await turso.execute({
      sql: `SELECT COUNT(*) as count FROM audit_log 
            WHERE org_id = ? AND action = 'scan' AND created_at > datetime('now', '-7 days')`,
      args: [orgId]
    });

    const statusMap: Record<string, number> = {};
    (assets.rows || []).forEach((row: any) => {
      statusMap[row.status || 'active'] = row.count;
    });

    return NextResponse.json({
      totalAssets: totalAssets.rows[0]?.count || 0,
      activeAssets: statusMap['active'] || 0,
      maintenanceAssets: statusMap['maintenance'] || 0,
      retiredAssets: statusMap['retired'] || 0,
      maintenanceDue: maintenanceDue.rows[0]?.count || 0,
      pendingWorkOrders: pendingWorkOrders.rows[0]?.count || 0,
      scansThisWeek: recentScans.rows[0]?.count || 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
