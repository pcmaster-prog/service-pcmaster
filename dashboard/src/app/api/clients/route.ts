import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'clients.json');

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const newClient = await req.json();
    let data = [];
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    
    const clientWithId = {
      ...newClient,
      id: newClient.id || Date.now(),
      status: newClient.status || 'active',
      balance: newClient.balance || '$ 0.00'
    };
    
    data.push(clientWithId);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, client: clientWithId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save client' }, { status: 500 });
  }
}
