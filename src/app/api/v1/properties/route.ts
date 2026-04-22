/**
 * PropertyPal QR API - Generate QR codes for rental properties
 */
import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

export async function POST(req: NextRequest) {
  try {
    const { 
      orgId,
      propertyId,
      propertyName,
      address,
      wifiSsid,
      wifiPassword,
      wifiType,
      checkInTime,
      checkOutTime,
      accessCode,
      listingUrl,
      customFields
    } = await req.json();

    if (!propertyName) {
      return NextResponse.json({ error: 'propertyName required' }, { status: 400 });
    }

    // Build the QR content - PropertyPal URL with embedded data
    const params = new URLSearchParams();
    if (wifiSsid) params.set('wifi_ssid', wifiSsid);
    if (wifiPassword) params.set('wifi_pass', wifiPassword);
    if (wifiType) params.set('wifi_type', wifiType);
    if (accessCode) params.set('code', accessCode);
    
    const qrContent = `https://propertypal.com/p/${propertyId || generateId().substring(0, 8)}?${params.toString()}`;

    // Store property in DB
    const id = propertyId || generateId();
    
    await turso.execute({
      sql: `INSERT OR REPLACE INTO properties 
            (id, org_id, name, address, wifi_ssid, wifi_password, wifi_type, check_in, check_out, access_code, listing_url, custom_fields)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, 
        orgId, 
        propertyName, 
        address,
        wifiSsid,
        wifiPassword,
        wifiType || 'WPA',
        checkInTime,
        checkOutTime,
        accessCode,
        listingUrl,
        JSON.stringify(customFields || {})
      ]
    });

    // Log to audit
    await turso.execute({
      sql: `INSERT INTO audit_log (id, org_id, action, entity_type, entity_id, description)
            VALUES (?, ?, 'create', 'property', ?, ?)`,
      args: [generateId(), orgId, id, `Created property: ${propertyName}`]
    });

    return NextResponse.json({
      success: true,
      propertyId: id,
      qrContent,
      qrUrl: `/api/v1/qr/property/${id}`
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    const result = await turso.execute({
      sql: 'SELECT * FROM properties WHERE org_id = ? ORDER BY created_at DESC',
      args: [orgId]
    });

    return NextResponse.json(result.rows);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
