import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) {
      return NextResponse.json({ error: 'orgId required' }, { status: 400 });
    }
    
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
    const { 
      orgId, 
      assetTag, 
      name, 
      description, 
      status, 
      category,
      location,
      purchaseDate,
      purchasePrice,
      currentValue,
      customFields,
      qrType,
      qrContent,
      locationData
    } = await req.json();
    
    if (!orgId || !assetTag || !name) {
      return NextResponse.json({ error: 'orgId, assetTag, name required' }, { status: 400 });
    }

    const id = generateId();
    const qrData = qrContent || `assethawk://asset/${id}`;
    
    await turso.execute({
      sql: `INSERT INTO assets (id, org_id, asset_tag, name, description, status, category, location, purchase_date, purchase_price, current_value, qr_data, qr_url, custom_fields)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, 
        orgId, 
        assetTag, 
        name, 
        description || null, 
        status || 'active', 
        category || null,
        location || null,
        purchaseDate || null,
        purchasePrice || null,
        currentValue || null,
        qrData, 
        qrContent || null
      ]
    });

    // If this is a location QR, also store location data
    if (qrType === 'location_qr' && locationData) {
      await turso.execute({
        sql: `INSERT INTO qr_location_data (id, asset_id, location_data) VALUES (?, ?, ?)`,
        args: [generateId(), id, typeof locationData === 'string' ? locationData : JSON.stringify(locationData)]
      });
    }

    // Log to audit
    await turso.execute({
      sql: `INSERT INTO audit_log (id, org_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'create', 'asset', ?, ?)`,
      args: [generateId(), orgId, id, `Created asset: ${name} (${assetTag}) - type: ${qrType || 'physical'}`]
    });

    return NextResponse.json({ success: true, id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
