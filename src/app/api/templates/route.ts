import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    
    if (orgId) {
      // Get org's templates
      const result = await turso.execute({
        sql: 'SELECT * FROM templates WHERE org_id = ? ORDER BY created_at DESC',
        args: [orgId]
      });
      return NextResponse.json(result.rows);
    } else {
      // Get public templates
      const result = await turso.execute({
        sql: 'SELECT * FROM templates WHERE is_public = 1 ORDER BY use_count DESC'
      });
      return NextResponse.json(result.rows);
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orgId, name, description, category, fields, isPublic } = await req.json();
    
    const id = generateId();
    await turso.execute({
      sql: `INSERT INTO templates (id, org_id, name, description, category, fields, is_public, use_count) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      args: [id, orgId, name, description, category, JSON.stringify(fields), isPublic ? 1 : 0]
    });

    return NextResponse.json({ success: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
