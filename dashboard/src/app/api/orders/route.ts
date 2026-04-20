import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'orders.json');

export async function GET() {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: NextRequest) {
  try {
    const newOrder = await req.json();
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    
    // Add timestamp and ID if missing
    const orderWithMetadata = {
      ...newOrder,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    
    data.push(orderWithMetadata);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, order: orderWithMetadata });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
  }
}
