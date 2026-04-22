/**
 * API Key Management
 */
import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    const result = await turso.execute({
      sql: 'SELECT id, name, key_prefix, created_at, last_used FROM api_keys WHERE org_id = ?',
      args: [orgId]
    });

    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orgId, name, scopes } = await req.json();
    
    if (!orgId || !name) {
      return NextResponse.json({ error: 'orgId and name required' }, { status: 400 });
    }

    const id = generateId();
    const key = `ah_live_${generateId()}${generateId()}`.replace(/-/g, '').substring(0, 48);
    const keyPrefix = key.substring(0, 12) + '...';
    
    await turso.execute({
      sql: `INSERT INTO api_keys (id, org_id, name, key, key_prefix, scopes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      args: [id, orgId, name, key, keyPrefix, JSON.stringify(scopes || ['assets:read', 'assets:write'])]
    });

    return NextResponse.json({
      success: true,
      id,
      key,
      name,
      keyPrefix,
      scopes: scopes || ['assets:read', 'assets:write'],
      message: 'Store this key securely - it will not be shown again'
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    await turso.execute({ sql: 'DELETE FROM api_keys WHERE id = ?', args: [id] });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
