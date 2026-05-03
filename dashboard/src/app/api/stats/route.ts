import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

export async function GET() {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      return NextResponse.json({ totalRevenue: 0, totalCommission: 0, topServices: [], activeCount: 0 });
    }

    const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    
    // Calcular ingresos y comisiones
    const totalRevenue = data.reduce((sum: number, o: any) => sum + (Number(o.amount) || 0), 0);
    const totalCommission = data.reduce((sum: number, o: any) => sum + (Number(o.commission) || 0), 0);
    const activeCount = data.filter((o: any) => o.status !== 'completed').length;

    // Obtener servicios más solicitados
    const serviceMap: any = {};
    data.forEach((order: any) => {
      if (Array.isArray(order.services)) {
        order.services.forEach((s: any) => {
          serviceMap[s.name] = (serviceMap[s.name] || 0) + 1;
        });
      }
    });

    const topServices = Object.entries(serviceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      totalRevenue,
      totalCommission,
      activeCount,
      topServices,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate stats' }, { status: 500 });
  }
}
