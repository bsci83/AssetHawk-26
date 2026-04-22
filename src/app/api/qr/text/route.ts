/**
 * API route to create a Text QR display page
 * Stores text content in Turso and returns a display URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId, now } from '@/lib/turso';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    // Create the table if it doesn't exist
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS qr_text_content (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Insert the text content
    const id = generateId();
    const createdAt = now();
    
    await turso.execute({
      sql: 'INSERT INTO qr_text_content (id, content, created_at) VALUES (?, ?, ?)',
      args: [id, text.trim(), createdAt]
    });

    // Return the display URL
    const displayUrl = `https://assethawk.sageaaa.com/p/${id}`;

    return NextResponse.json({
      success: true,
      id,
      displayUrl,
      qrUrl: displayUrl
    });

  } catch (error) {
    console.error('Error creating text QR:', error);
    return NextResponse.json({ error: 'Failed to create text QR' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    // Ensure table exists
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS qr_text_content (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    const result = await turso.execute({
      sql: 'SELECT * FROM qr_text_content WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Text content not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      content: result.rows[0].content,
      createdAt: result.rows[0].created_at
    });

  } catch (error) {
    console.error('Error fetching text QR:', error);
    return NextResponse.json({ error: 'Failed to fetch text QR' }, { status: 500 });
  }
}
