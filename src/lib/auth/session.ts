/**
 * Auth session helper for API routes and server components.
 * Returns the authenticated user ID from the NextAuth JWT token.
 */

import { getToken } from 'next-auth/jwt';
import { cookies, headers } from 'next/headers';

/** Retrieve the current authenticated user's ID. Returns null when no session exists. */
export async function getAuthUserId(): Promise<string | null> {
  try {
    // Build a minimal request-like object from Next.js headers for getToken
    const cookieStore = await cookies();
    const headerList = await headers();

    const req = {
      cookies: Object.fromEntries(
        cookieStore.getAll().map((c) => [c.name, c.value])
      ),
      headers: Object.fromEntries(headerList.entries()),
    };

    const token = await getToken({
      req: req as Parameters<typeof getToken>[0]['req'],
      secret: process.env.NEXTAUTH_SECRET,
    });

    return (token?.userId as string) ?? null;
  } catch {
    return null;
  }
}

/** Demo user ID used when running in mock/demo mode without authentication. */
export const DEMO_USER_ID = 'demo-user-00000000';
