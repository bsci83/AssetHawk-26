/**
 * NextAuth v5 API route handler.
 * Exports GET and POST handlers for all /api/auth/* routes.
 */

import { handlers } from '@/lib/auth/config';

export const { GET, POST } = handlers;
