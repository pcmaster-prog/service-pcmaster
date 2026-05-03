import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 1, name: "Admin (Prueba)", role: "admin", username: "admin", pin: "1234" },
    { id: 2, name: "Tecnico (Prueba)", role: "technician", username: "tecnico", pin: "0000" }
  ]);
}

export async function POST() {
  return NextResponse.json({ success: true });
}
