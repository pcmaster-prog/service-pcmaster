import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'orders.json');

export async function GET() {
  try {
    const DATA_FILE = path.join(process.cwd(), 'data', 'orders.json');
    if (!fs.existsSync(DATA_FILE)) return NextResponse.json([]);
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return NextResponse.json(data ? JSON.parse(data) : []);
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const newOrder = await req.json();
    let data = [];
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
      data = fileContent ? JSON.parse(fileContent) : [];
    }
    
    const orderWithMetadata = {
      ...newOrder,
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: newOrder.status || 'pending'
    };
    
    data.push(orderWithMetadata);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    // Update clients database
    const CLIENTS_FILE = path.join(process.cwd(), 'data', 'clients.json');
    let clients = [];
    if (fs.existsSync(CLIENTS_FILE)) {
      const clientContent = fs.readFileSync(CLIENTS_FILE, 'utf8');
      clients = clientContent ? JSON.parse(clientContent) : [];
    }

    const clientData = newOrder.client; // Expecting an object from mobile
    if (clientData && clientData.name) {
      const clientIndex = clients.findIndex((c: any) => c.name === clientData.name);
      
      if (clientIndex === -1) {
        const newClient = {
          id: Date.now(),
          name: clientData.name,
          phone: clientData.phone || 'No especificado',
          zone: clientData.zone || 'General',
          rating: 5,
          balance: `$ ${(newOrder.amount || 0).toFixed(2)}`,
          status: 'active'
        };
        clients.push(newClient);
      } else {
        const currentBalance = parseFloat(clients[clientIndex].balance.replace('$ ', '').replace(',', '')) || 0;
        const additionalBalance = newOrder.amount || 0;
        clients[clientIndex].balance = `$ ${(currentBalance + additionalBalance).toFixed(2)}`;
        clients[clientIndex].phone = clientData.phone || clients[clientIndex].phone;
      }
      fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2));
    }
    
    return NextResponse.json({ success: true, order: orderWithMetadata });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
  }
}
