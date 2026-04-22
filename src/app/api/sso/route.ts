import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

// SSO configuration
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    const result = await turso.execute({
      sql: 'SELECT settings FROM organizations WHERE id = ?',
      args: [orgId]
    });

    const settings = result.rows[0]?.settings ? JSON.parse(result.rows[0].settings as string) : {};
    const sso = settings.sso || { enabled: false, provider: null, entityId: null };

    return NextResponse.json(sso);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orgId, provider, domain, clientId, clientSecret, issuerUrl } = await req.json();
    
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    // Get current settings
    const result = await turso.execute({
      sql: 'SELECT settings FROM organizations WHERE id = ?',
      args: [orgId]
    });

    const currentSettings = result.rows[0]?.settings ? JSON.parse(result.rows[0].settings as string) : {};
    
    // Update SSO config
    const ssoConfig = {
      enabled: true,
      provider,
      domain,
      entityId: `assethawk-${orgId.substring(0, 8)}`,
      clientId,
      // Note: clientSecret should be stored securely, not in plain DB
      configuredAt: new Date().toISOString()
    };

    currentSettings.sso = ssoConfig;

    await turso.execute({
      sql: 'UPDATE organizations SET settings = ? WHERE id = ?',
      args: [JSON.stringify(currentSettings), orgId]
    });

    return NextResponse.json({ success: true, entityId: ssoConfig.entityId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get('orgId');
    if (!orgId) return NextResponse.json({ error: 'orgId required' }, { status: 400 });

    const result = await turso.execute({
      sql: 'SELECT settings FROM organizations WHERE id = ?',
      args: [orgId]
    });

    const currentSettings = result.rows[0]?.settings ? JSON.parse(result.rows[0].settings as string) : {};
    delete currentSettings.sso;

    await turso.execute({
      sql: 'UPDATE organizations SET settings = ? WHERE id = ?',
      args: [JSON.stringify(currentSettings), orgId]
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
