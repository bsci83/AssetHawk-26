import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user
    const result = await turso.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];
    const valid = await verifyPassword(password, user.password_hash as string);

    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Get user's org
    const orgResult = await turso.execute({
      sql: `SELECT o.* FROM organizations o 
            JOIN user_orgs uo ON o.id = uo.org_id 
            WHERE uo.user_id = ? LIMIT 1`,
      args: [user.id]
    });

    const org = orgResult.rows[0];

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      org: org ? { id: org.id, name: org.name, slug: org.slug } : null
    });
  } catch (e: any) {
    console.error('Signin error:', e);
    return NextResponse.json({ error: 'Signin failed' }, { status: 500 });
  }
}
