/**
 * AssetHawk on Ninja Sites - Core Setup
 * QR code management platform rebuilt on Turso
 */

import { createClient } from '@libsql/client';

// Use existing AssetHawk Turso database
export const turso = createClient({
  url: 'libsql://assethawk-bifill.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzY3OTMzMzksImlkIjoiMDE5ZGIxMjItOTYwMS03N2UzLThjNjAtMDhkOTQ5MTI5M2UyIiwicmlkIjoiMDVlMTA0ZTgtYzIyYi00MzFjLTkxMzctMjVhNzU3OGJlNGFmIn0.6HgCivTBIwfKX1t8n92YdunXdcqxLAHByjv4iR84SOIQ6hk0cOeFpZWotV01ZrklB1ocF6lVq9bavBG-mGd4AQ',
});

// Simple crypto utilities
export function generateId() {
  return crypto.randomUUID();
}

export function now() {
  return new Date().toISOString();
}
