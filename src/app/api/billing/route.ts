import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// Billing stats
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    // Get plan info from org settings
    const result = await turso.execute({
      sql: 'SELECT settings FROM organizations WHERE id = ?',
      args: [orgId]
    });

    const settings = result.rows[0]?.settings ? JSON.parse(result.rows[0].settings as string) : {};
    
    return NextResponse.json({
      plan: settings.plan || 'starter',
      status: 'active',
      currentPeriodEnd: '2026-05-01',
      cancelAtPeriodEnd: false,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
