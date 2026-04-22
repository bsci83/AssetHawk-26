import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

/**
 * Create a Dynamic QR Code
 * Unlike static QR codes which contain the data directly,
 * dynamic QR codes point to a resolution service that redirects
 * to the current content.
 */
export async function POST(req: NextRequest) {
  try {
    const { 
      orgId,
      type, // 'property' | 'asset'
      name,
      assetTag,
      initialData, // Initial content the QR resolves to
      description,
      customFields,
      category
    } = await req.json();

    if (!orgId || !name) {
      return NextResponse.json({ error: 'orgId and name required' }, { status: 400 });
    }

    // Create the entity first
    let entityId: string;
    const qrId = generateId();
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Build the dynamic URL that resolves this QR
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://assethawk.com';
    const resolveUrl = `${baseUrl}/api/resolve/${qrId}`;

    if (type === 'property') {
      // Create property with dynamic QR
      entityId = generateId();
      await turso.execute({
        sql: `INSERT INTO properties (id, org_id, name, slug, description, custom_fields)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [entityId, orgId, name, slug, description || null, JSON.stringify(customFields || {})]
      });
    } else {
      // Create asset with dynamic QR
      entityId = generateId();
      await turso.execute({
        sql: `INSERT INTO assets (id, org_id, asset_tag, name, description, qr_data, custom_fields, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
        args: [entityId, orgId, assetTag || `DYN-${qrId.substring(0, 8)}`, name, description || null, resolveUrl, JSON.stringify(customFields || {})]
      });
    }

    // Link QR ID to the entity in our qr_codes table
    await turso.execute({
      sql: `INSERT INTO qr_codes (id, org_id, entity_id, entity_type, name, resolved_url, is_dynamic, click_count)
            VALUES (?, ?, ?, ?, ?, ?, 1, 0)`,
      args: [qrId, orgId, entityId, type, name, initialData || resolveUrl]
    });

    // Log to audit
    await turso.execute({
      sql: `INSERT INTO audit_log (id, org_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'create', 'qr_code', ?, ?)`,
      args: [generateId(), orgId, qrId, `Created dynamic QR: ${name}`]
    });

    return NextResponse.json({
      success: true,
      qrId,
      entityId,
      entityType: type,
      name,
      resolveUrl, // This is what goes in the QR code
      qrContent: `${resolveUrl}?format=json` // For API callers who want JSON
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * Update where a dynamic QR points to
 * This is the key feature - change the content without reprinting!
 */
export async function PUT(req: NextRequest) {
  try {
    const { qrId, newUrl, label } = await req.json();

    if (!qrId) {
      return NextResponse.json({ error: 'qrId required' }, { status: 400 });
    }

    // Update where this QR resolves to
    await turso.execute({
      sql: `UPDATE qr_codes SET resolved_url = ?, updated_at = datetime('now') WHERE id = ?`,
      args: [newUrl, qrId]
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/**
 * List dynamic QR codes for an organization
 */
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) {
      return NextResponse.json({ error: 'orgId required' }, { status: 400 });
    }

    const result = await turso.execute({
      sql: `SELECT q.*, 
                   CASE WHEN q.entity_type = 'property' THEN p.name ELSE a.name END as entity_name,
                   CASE WHEN q.entity_type = 'property' THEN p.address ELSE a.location END as location
            FROM qr_codes q
            LEFT JOIN properties p ON q.entity_id = p.id AND q.entity_type = 'property'
            LEFT JOIN assets a ON q.entity_id = a.id AND q.entity_type = 'asset'
            WHERE q.org_id = ? AND q.is_dynamic = 1
            ORDER BY q.created_at DESC`,
      args: [orgId]
    });

    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
