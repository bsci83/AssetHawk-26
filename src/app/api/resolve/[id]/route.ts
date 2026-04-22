import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

/**
 * Dynamic QR Resolution API
 * When someone scans a dynamic QR code, this endpoint looks up where they should go
 * and either:
 * - Redirects to the property/asset page
 * - Returns JSON with current data (for API callers)
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const format = req.nextUrl.searchParams.get('format') || 'redirect'; // redirect | json

    // Look up in properties first (PropertyPal)
    let result = await turso.execute({
      sql: 'SELECT * FROM properties WHERE id = ? OR slug = ?',
      args: [id, id]
    });

    let type = 'property';
    let data = result.rows[0];

    // If not found, check assets
    if (!data) {
      result = await turso.execute({
        sql: 'SELECT * FROM assets WHERE id = ? OR asset_tag = ?',
        args: [id, id]
      });
      type = 'asset';
      data = result.rows[0];
    }

    // Not found
    if (!data) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Log the scan event
    await turso.execute({
      sql: `INSERT INTO audit_log (id, org_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'scan', ?, ?, 'Dynamic QR scanned')`,
      args: [generateId(), data.org_id, type, data.id]
    });

    // Return JSON if requested
    if (format === 'json') {
      return NextResponse.json({
        type,
        id: data.id,
        name: data.name,
        data
      });
    }

    // Default: redirect to property page
    if (type === 'property') {
      return NextResponse.redirect(`https://propertypal.com/p/${data.id}`);
    }

    // Asset redirect
    return NextResponse.redirect(`https://assethawk.com/assets/${data.id}`);

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
