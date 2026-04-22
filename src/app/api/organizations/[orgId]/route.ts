import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    const result = await turso.execute({
      sql: 'SELECT * FROM organizations WHERE id = ?',
      args: [orgId]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const org = result.rows[0];
    return NextResponse.json({
      id: org.id,
      name: org.name,
      slug: org.slug,
      description: org.description,
      settings: org.settings ? JSON.parse(org.settings as string) : {},
      created_at: org.created_at
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orgId, name, description, settings } = await req.json();
    
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    const updates: string[] = [];
    const args: any[] = [];

    if (name) {
      updates.push('name = ?');
      args.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      args.push(description);
    }
    if (settings) {
      updates.push('settings = ?');
      args.push(JSON.stringify(settings));
    }
    updates.push("updated_at = datetime('now')");
    args.push(orgId);

    await turso.execute({
      sql: `UPDATE organizations SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
