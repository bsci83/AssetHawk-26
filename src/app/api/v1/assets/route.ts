import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

// Full REST API for assets
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    const id = req.nextUrl.searchParams.get('id');
    
    if (id) {
      // Get single asset
      const result = await turso.execute({
        sql: 'SELECT * FROM assets WHERE id = ?',
        args: [id]
      });
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }
      return NextResponse.json(result.rows[0]);
    }
    
    if (!orgId) {
      return NextResponse.json({ error: 'orgId required' }, { status: 400 });
    }
    
    // List all assets for org
    const status = req.nextUrl.searchParams.get('status');
    let sql = 'SELECT * FROM assets WHERE org_id = ?';
    const args: string[] = [orgId];
    
    if (status) {
      sql += ' AND status = ?';
      args.push(status);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const result = await turso.execute({ sql, args });
    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orgId, assetTag, name, description, status, customFields } = await req.json();
    
    if (!orgId || !assetTag || !name) {
      return NextResponse.json({ error: 'orgId, assetTag, name required' }, { status: 400 });
    }

    const id = generateId();
    const qrData = `assethawk://asset/${id}`;
    
    await turso.execute({
      sql: `INSERT INTO assets (id, org_id, asset_tag, name, description, status, qr_data, custom_fields)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, orgId, assetTag, name, description || null, status || 'active', qrData, JSON.stringify(customFields || {})]
    });

    // Log to audit
    await turso.execute({
      sql: `INSERT INTO audit_log (id, org_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'create', 'asset', ?, ?)`,
      args: [generateId(), orgId, id, `Created asset: ${name} (${assetTag})`]
    });

    return NextResponse.json({ success: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, description, status, customFields } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    // Get old values for audit
    const old = await turso.execute({ sql: 'SELECT * FROM assets WHERE id = ?', args: [id] });
    if (old.rows.length === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    const updates: string[] = ['updated_at = datetime("now")'];
    const args: any[] = [];
    
    if (name !== undefined) { updates.push('name = ?'); args.push(name); }
    if (description !== undefined) { updates.push('description = ?'); args.push(description); }
    if (status !== undefined) { updates.push('status = ?'); args.push(status); }
    if (customFields !== undefined) { updates.push('custom_fields = ?'); args.push(JSON.stringify(customFields)); }
    
    args.push(id);
    
    await turso.execute({
      sql: `UPDATE assets SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    // Log to audit
    await turso.execute({
      sql: `INSERT INTO audit_log (id, action, entity_type, entity_id, description, old_values, new_values)
            VALUES (?, 'update', 'asset', ?, ?, ?, ?)`,
      args: [generateId(), id, `Updated asset: ${name}`, JSON.stringify(old.rows[0]), JSON.stringify({ name, description, status })]
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    await turso.execute({ sql: 'DELETE FROM assets WHERE id = ?', args: [id] });
    
    await turso.execute({
      sql: `INSERT INTO audit_log (id, action, entity_type, entity_id, description) VALUES (?, 'delete', 'asset', ?, 'Asset deleted')`,
      args: [generateId(), id]
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
