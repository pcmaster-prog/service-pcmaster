import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SERVICES_FILE = path.join(process.cwd(), 'data', 'services.json');

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'services.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('API Services Error:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array instead of error for stability
  }
}
