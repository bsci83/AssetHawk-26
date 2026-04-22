import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = await turso.execute({
      sql: 'SELECT * FROM assets WHERE id = ?',
      args: [id]
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (e: any) {
    console.error('GET asset error:', e);
    return NextResponse.json({ error: 'Failed to load asset' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, description, status, category, location, purchaseDate, purchasePrice, currentValue } = await req.json();
    
    const updates: string[] = ['updated_at = datetime("now")'];
    const args: any[] = [];
    
    if (name !== undefined) { updates.push('name = ?'); args.push(name); }
    if (description !== undefined) { updates.push('description = ?'); args.push(description); }
    if (status !== undefined) { updates.push('status = ?'); args.push(status); }
    if (category !== undefined) { updates.push('category = ?'); args.push(category); }
    if (location !== undefined) { updates.push('location = ?'); args.push(location); }
    if (purchaseDate !== undefined) { updates.push('purchase_date = ?'); args.push(purchaseDate); }
    if (purchasePrice !== undefined) { updates.push('purchase_price = ?'); args.push(purchasePrice); }
    if (currentValue !== undefined) { updates.push('current_value = ?'); args.push(currentValue); }
    
    args.push(id);
    
    await turso.execute({
      sql: `UPDATE assets SET ${updates.join(', ')} WHERE id = ?`,
      args
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await turso.execute({
      sql: 'DELETE FROM assets WHERE id = ?',
      args: [id]
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('DELETE asset error:', e);
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}
