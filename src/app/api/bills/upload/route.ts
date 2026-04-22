import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // TODO: Get user from session
    const userId = 'demo-user'; // Placeholder
    
    // Generate ID and save file
    const id = uuid();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Save to uploads directory
    const uploadDir = join(process.cwd(), 'uploads');
    await mkdir(uploadDir, { recursive: true });
    
    const filename = `${id}-${file.name}`;
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);
    
    // TODO: Save to Turso database
    // For now, return the ID
    
    return NextResponse.json({ 
      id,
      filename: file.name,
      status: 'pending'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
