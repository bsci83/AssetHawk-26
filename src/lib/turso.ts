import { createClient, type Client } from '@libsql/client';

let turso: Client | null = null;

export function getTurso(): Client {
  if (!turso) {
    turso = createClient({
      url: process.env.TURSO_DATABASE_URL || '',
      authToken: process.env.TURSO_AUTH_TOKEN || '',
    });
  }
  return turso;
}

// Helper to execute queries
export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const result = await getTurso().execute({ sql, args: params as never });
  return result.rows as T[];
}

export async function execute(sql: string, params: unknown[] = []) {
  return getTurso().execute({ sql, args: params as never });
}
